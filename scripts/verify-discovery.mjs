import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const expectedProjects = [
  'apps/passenger-pwa',
  'apps/admin-web',
  'services/api',
  'packages/contracts',
  'packages/design-tokens',
  'packages/config',
];
const requiredScripts = ['lint', 'typecheck', 'test', 'build'];

function findTests(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === 'dist') return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findTests(path);
    return /\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

const failures = [];
const discovered = [];

for (const project of expectedProjects) {
  const directory = join(root, project);
  const manifestPath = join(directory, 'package.json');
  if (!existsSync(manifestPath) || !statSync(manifestPath).isFile()) {
    failures.push(`${project}: package.json not found`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const missingScripts = requiredScripts.filter((script) => !manifest.scripts?.[script]);
  if (missingScripts.length > 0) failures.push(`${project}: missing scripts: ${missingScripts.join(', ')}`);
  const tests = findTests(directory);
  if (tests.length === 0) failures.push(`${project}: no unit tests discovered`);
  discovered.push({ project, tests: tests.length });
}

if (discovered.length !== expectedProjects.length || failures.length > 0) {
  console.error('Workspace discovery failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const testCount = discovered.reduce((sum, item) => sum + item.tests, 0);
console.log(`Workspace discovery passed: ${discovered.length} projects, ${testCount} test files.`);
for (const item of discovered) console.log(`- ${item.project}: ${item.tests} test file(s)`);
