import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve(import.meta.dirname, '..', 'e2e');
const tests = existsSync(directory)
  ? readdirSync(directory).filter((name) => /\.spec\.[cm]?[jt]s$/.test(name))
  : [];

if (tests.length === 0) {
  console.error('Browser test discovery failed: no e2e/*.spec.ts files were found.');
  process.exit(1);
}

console.log(`Browser test discovery passed: ${tests.length} Playwright file(s).`);
