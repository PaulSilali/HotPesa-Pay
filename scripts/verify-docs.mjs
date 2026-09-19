import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const controlledDirectory = join(root, 'docs', 'controlled-documents');
const specificationsDirectory = join(root, 'docs', 'specifications');

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function parseFrontMatter(path) {
  const content = readFileSync(path, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([a-z0-9_]+):\s*(.*)$/);
    if (!item) continue;
    let value = item[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    metadata[item[1]] = value;
  }
  return metadata;
}

const failures = [];
const verified = [];

if (!existsSync(controlledDirectory) || !statSync(controlledDirectory).isDirectory()) {
  failures.push('Controlled document directory is missing: docs/controlled-documents');
}
if (!existsSync(specificationsDirectory) || !statSync(specificationsDirectory).isDirectory()) {
  failures.push('Specification directory is missing: docs/specifications');
}

const docxFiles = existsSync(controlledDirectory)
  ? readdirSync(controlledDirectory).filter((name) => /^\d{2}_.+\.docx$/i.test(name)).sort()
  : [];
const markdownFiles = existsSync(specificationsDirectory)
  ? readdirSync(specificationsDirectory).filter((name) => /^\d{2}_.+\.md$/i.test(name)).sort()
  : [];

if (docxFiles.length === 0) failures.push('No controlled DOCX files were found.');

const markdownById = new Map();
for (const name of markdownFiles) {
  const id = name.slice(0, 2);
  if (markdownById.has(id)) failures.push(`Document ${id}: multiple Markdown counterparts found`);
  markdownById.set(id, name);
}

const requiredMetadata = [
  'document_id',
  'title',
  'project',
  'source_docx',
  'source_version',
  'source_status',
  'synchronization_date',
  'source_sha256',
];

for (const docxName of docxFiles) {
  const id = docxName.slice(0, 2);
  const markdownName = markdownById.get(id);
  const sourcePath = join(controlledDirectory, docxName);
  const checksum = sha256(sourcePath);

  if (!markdownName) {
    failures.push(`Document ${id}: Markdown counterpart missing for ${docxName}`);
    continue;
  }

  const markdownPath = join(specificationsDirectory, markdownName);
  const metadata = parseFrontMatter(markdownPath);
  if (!metadata) {
    failures.push(`Document ${id}: YAML front matter missing or invalid in ${markdownName}`);
    continue;
  }

  const missingFields = requiredMetadata.filter((field) => !metadata[field]);
  if (missingFields.length > 0) {
    failures.push(`Document ${id}: missing metadata fields: ${missingFields.join(', ')}`);
  }
  if (metadata.document_id !== id) failures.push(`Document ${id}: document_id is ${metadata.document_id ?? 'missing'}`);
  if (metadata.project !== 'HotPesa Pay') failures.push(`Document ${id}: project metadata is not HotPesa Pay`);
  if (metadata.source_docx !== `docs/controlled-documents/${docxName}`) {
    failures.push(`Document ${id}: source_docx does not identify ${docxName}`);
  }
  if (metadata.source_sha256?.toLowerCase() !== checksum) {
    failures.push(`Document ${id}: stale Markdown copy (source checksum ${checksum})`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.synchronization_date ?? '')) {
    failures.push(`Document ${id}: synchronization_date must use YYYY-MM-DD`);
  }
  if (!readFileSync(markdownPath, 'utf8').includes(`../controlled-documents/${encodeURIComponent(docxName)}`)) {
    failures.push(`Document ${id}: controlled DOCX source link is missing`);
  }

  verified.push({ id, docxName, markdownName, checksum });
  markdownById.delete(id);
}

for (const [id, markdownName] of markdownById) {
  failures.push(`Document ${id}: orphan Markdown specification ${markdownName}`);
}

if (failures.length > 0) {
  console.error(`Documentation verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Documentation verification passed: ${verified.length} controlled DOCX/Markdown pair(s).`);
for (const item of verified) {
  console.log(`- ${item.id}: ${basename(item.docxName)} -> ${item.markdownName} (${item.checksum})`);
}
