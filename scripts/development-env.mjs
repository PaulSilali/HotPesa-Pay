import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

export function loadDevelopmentEnvironment() {
  const shellKeys = new Set(Object.keys(process.env));
  for (const file of ['.env.example', '.env.development']) {
    const path = new URL(`../${file}`, import.meta.url);
    if (!existsSync(path)) continue;
    for (const [key, value] of Object.entries(parseEnv(readFileSync(path, 'utf8')))) {
      if (!shellKeys.has(key)) process.env[key] = value;
    }
  }
}
