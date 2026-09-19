[CmdletBinding()]
param(
    [switch]$Write,
    [string]$SynchronizationDate = (Get-Date -Format 'yyyy-MM-dd')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot 'docs/controlled-documents'
$outputRoot = Join-Path $repoRoot 'docs/specifications'

if (-not $Write) {
    Write-Host 'Dry run only. No files will be changed. Re-run with -Write to synchronize Markdown specifications.'
}

function Get-EntryText {
    param($Archive, [string]$Name)
    $entry = $Archive.GetEntry($Name)
    if (-not $entry) { return $null }
    $reader = [System.IO.StreamReader]::new($entry.Open())
    try { $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Get-NodeText {
    param($Node, $Namespaces)
    (($Node.SelectNodes('.//w:t | .//w:tab | .//w:br', $Namespaces) | ForEach-Object {
        if ($_.LocalName -eq 't') { $_.InnerText }
        elseif ($_.LocalName -eq 'tab') { "`t" }
        else { '<br>' }
    }) -join '')
}

function Escape-MarkdownTableCell {
    param([string]$Value)
    if ($null -eq $Value) { return '' }
    ($Value -replace '\|', '\|' -replace "`r?`n", '<br>')
}

function Get-TableRows {
    param($Table, $Namespaces)
    $rows = @()
    foreach ($row in $Table.SelectNodes('./w:tr', $Namespaces)) {
        $cells = @()
        foreach ($cell in $row.SelectNodes('./w:tc', $Namespaces)) {
            $paragraphs = @()
            foreach ($paragraph in $cell.SelectNodes('./w:p', $Namespaces)) {
                $text = Get-NodeText $paragraph $Namespaces
                if ($text) { $paragraphs += $text }
            }
            $cells += (($paragraphs -join '<br>') | ForEach-Object { Escape-MarkdownTableCell $_ })
        }
        $rows += ,$cells
    }
    $rows
}

function Convert-TableToMarkdown {
    param($Table, $Namespaces)
    $rows = @(Get-TableRows $Table $Namespaces)
    if ($rows.Count -eq 0) { return '' }
    $width = ($rows | ForEach-Object { $_.Count } | Measure-Object -Maximum).Maximum
    if (-not $width) { return '' }
    $normalized = foreach ($row in $rows) {
        $copy = @($row)
        while ($copy.Count -lt $width) { $copy += '' }
        ,$copy
    }
    $lines = @('| ' + ($normalized[0] -join ' | ') + ' |')
    $lines += '| ' + ((1..$width | ForEach-Object { '---' }) -join ' | ') + ' |'
    foreach ($row in ($normalized | Select-Object -Skip 1)) {
        $lines += '| ' + ($row -join ' | ') + ' |'
    }
    $lines -join "`n"
}

function Get-ControlValue {
    param($Table, $Namespaces, [string]$Label)
    foreach ($row in (Get-TableRows $Table $Namespaces)) {
        if ($row.Count -ge 2 -and $row[0].Trim() -eq $Label) { return $row[1].Trim() }
    }
    ''
}

function Get-YamlString {
    param([string]$Value)
    '"' + ($Value -replace '\\', '\\' -replace '"', '\"') + '"'
}

function Get-OutputName {
    param([string]$SourceName)
    $base = [System.IO.Path]::GetFileNameWithoutExtension($SourceName)
    (($base -replace '[()]', '' -replace '[^A-Za-z0-9]+', '_').Trim('_') + '.md')
}

$sources = Get-ChildItem -LiteralPath $sourceRoot -Filter '*.docx' | Sort-Object Name
if ($sources.Count -eq 0) { throw "No controlled DOCX files found in $sourceRoot" }

foreach ($source in $sources) {
    $archive = [System.IO.Compression.ZipFile]::OpenRead($source.FullName)
    try {
        [xml]$document = Get-EntryText $archive 'word/document.xml'
        [xml]$styles = Get-EntryText $archive 'word/styles.xml'
        [xml]$relationships = Get-EntryText $archive 'word/_rels/document.xml.rels'

        $ns = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
        $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        $ns.AddNamespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        $ns.AddNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main')
        $ns.AddNamespace('wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')

        $styleNames = @{}
        foreach ($style in $styles.SelectNodes('//w:style[@w:type="paragraph"]', $ns)) {
            $styleId = $style.GetAttribute('styleId', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
            $name = $style.SelectSingleNode('w:name', $ns)
            if ($name) {
                $styleNames[$styleId] = $name.GetAttribute('val', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
            }
        }

        $relationshipTargets = @{}
        if ($relationships) {
            foreach ($relationship in $relationships.Relationships.Relationship) {
                $relationshipTargets[$relationship.Id] = $relationship.Target
            }
        }

        $tables = $document.SelectNodes('//w:body/w:tbl', $ns)
        if ($tables.Count -lt 2) { throw "$($source.Name) has no complete document-control tables" }
        $documentTitle = Get-ControlValue $tables[0] $ns 'Document'
        $version = Get-ControlValue $tables[0] $ns 'Version'
        $status = Get-ControlValue $tables[0] $ns 'Status'
        $owner = Get-ControlValue $tables[1] $ns 'Document owner'
        $documentId = [regex]::Match($source.Name, '^\d{2}').Value
        if (-not $documentId -or -not $documentTitle -or -not $version -or -not $status -or -not $owner) {
            throw "Could not derive controlled metadata from $($source.Name)"
        }

        $checksum = (Get-FileHash -Algorithm SHA256 -LiteralPath $source.FullName).Hash.ToLowerInvariant()
        $outputName = Get-OutputName $source.Name
        $outputPath = Join-Path $outputRoot $outputName
        $assetRelativeRoot = "assets/$documentId"
        $assetRoot = Join-Path $outputRoot "assets/$documentId"
        $sourceRelativePath = 'docs/controlled-documents/' + $source.Name

        $lines = @(
            '---',
            "document_id: $(Get-YamlString $documentId)",
            "title: $(Get-YamlString $documentTitle)",
            'project: "HotPesa Pay"',
            "source_docx: $(Get-YamlString $sourceRelativePath)",
            "source_version: $(Get-YamlString $version)",
            "source_status: $(Get-YamlString $status)",
            "synchronization_date: $(Get-YamlString $SynchronizationDate)",
            "source_sha256: $(Get-YamlString $checksum)",
            '---',
            '',
            "> Controlled source: [$($source.Name)](../controlled-documents/$([uri]::EscapeDataString($source.Name)))",
            '',
            '> The DOCX source is authoritative. This Markdown copy preserves its controlled status and does not confer approval.',
            ''
        )

        $imageIndex = 0
        foreach ($block in $document.SelectNodes('//w:body/*', $ns)) {
            if ($block.LocalName -eq 'p') {
                $text = Get-NodeText $block $ns
                $styleNode = $block.SelectSingleNode('w:pPr/w:pStyle', $ns)
                $styleId = if ($styleNode) { $styleNode.GetAttribute('val', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main') } else { '' }
                $styleName = if ($styleNames.ContainsKey($styleId)) { $styleNames[$styleId] } else { $styleId }
                $headingLevel = 0
                if ($styleName -match '^heading\s*([123])$' -or $styleId -match '^Heading([123])$') {
                    $headingLevel = [int]$Matches[1]
                }

                if ($text) {
                    if ($headingLevel -gt 0) { $lines += ('#' * $headingLevel) + ' ' + $text }
                    elseif ($block.SelectSingleNode('w:pPr/w:numPr', $ns)) { $lines += '- ' + $text }
                    else { $lines += $text }
                    $lines += ''
                }

                foreach ($drawing in $block.SelectNodes('.//a:blip[@r:embed]', $ns)) {
                    $relationshipId = $drawing.GetAttribute('embed', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
                    $target = $relationshipTargets[$relationshipId]
                    if (-not $target) { continue }
                    $entryName = ('word/' + $target).Replace('word/../', '')
                    $entry = $archive.GetEntry($entryName)
                    if (-not $entry) { continue }
                    $imageIndex++
                    $extension = [System.IO.Path]::GetExtension($entry.Name).ToLowerInvariant()
                    $assetName = ('image-{0:d2}{1}' -f $imageIndex, $extension)
                    $descriptionNode = $block.SelectSingleNode('.//wp:docPr', $ns)
                    $description = if ($descriptionNode -and $descriptionNode.GetAttribute('descr')) { $descriptionNode.GetAttribute('descr') } elseif ($descriptionNode -and $descriptionNode.GetAttribute('title')) { $descriptionNode.GetAttribute('title') } else { "Document $documentId diagram $imageIndex" }
                    $lines += "![$description]($assetRelativeRoot/$assetName)"
                    $lines += ''
                    if ($Write) {
                        New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null
                        $destination = Join-Path $assetRoot $assetName
                        $inputStream = $entry.Open()
                        $outputStream = [System.IO.File]::Create($destination)
                        try { $inputStream.CopyTo($outputStream) } finally { $inputStream.Dispose(); $outputStream.Dispose() }
                    }
                }
            }
            elseif ($block.LocalName -eq 'tbl') {
                $markdownTable = Convert-TableToMarkdown $block $ns
                if ($markdownTable) { $lines += $markdownTable; $lines += '' }
            }
        }

        $content = (($lines -join "`n").TrimEnd() + "`n")
        if ($Write) {
            New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
            [System.IO.File]::WriteAllText($outputPath, $content, [System.Text.UTF8Encoding]::new($false))
            Write-Host "Synchronized $($source.Name) -> $outputName"
        }
        else {
            Write-Host "Would synchronize $($source.Name) -> $outputName ($checksum)"
        }
    }
    finally {
        $archive.Dispose()
    }
}
