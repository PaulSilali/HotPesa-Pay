import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadDevelopmentEnvironment } from './development-env.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const passengerRoot = fileURLToPath(new URL('../apps/passenger-pwa/', import.meta.url));
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const command = process.argv[2] ?? 'stack';

loadDevelopmentEnvironment();

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const compose = ['compose', '-f', 'infra/docker/compose.yml'];
const children = [];

function run(file, args, options = {}) {
  const child = spawn(file, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32' && file === pnpm,
    ...options,
  });
  children.push(child);
  return child;
}

function runAndWait(file, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32' && file === pnpm,
    });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${file} ${args.join(' ')} exited ${code ?? 'without a code'}`)));
  });
}

function endpointOutput() {
  const host = process.env.HOTPESA_LOCAL_HOST ?? '127.0.0.1';
  const apiPort = process.env.PORT ?? '3000';
  console.log(`\nHotPesa development endpoints\nPassenger: http://${host}:4173\nAPI health: http://${host}:${apiPort}/health\n`);
}

async function startInfra() {
  await runAndWait('docker', [...compose, 'up', '-d']);
}

async function buildApi() {
  await runAndWait(pnpm, ['--filter', '@hotpesa/api', 'build']);
}

function startApi() { return run('node', ['services/api/dist/src/main.js']); }
function startWorker() { return run('node', ['services/api/dist/src/worker.js']); }
function startPassenger() {
  return run(process.execPath, [viteCli, '--host', process.env.VITE_HOST ?? '127.0.0.1', '--port', '4173', '--strictPort'], { cwd: passengerRoot });
}

async function stopInfra() {
  await runAndWait('docker', [...compose, 'stop']);
}

async function main() {
  if (command === 'infra') return startInfra();
  if (command === 'stop') return stopInfra();
  if (command === 'api' || command === 'worker') await buildApi();
  if (command === 'api') return startApi();
  if (command === 'worker') return startWorker();
  if (command === 'passenger') return startPassenger();
  if (command !== 'stack') throw new Error(`Unknown development command: ${command}`);

  await startInfra();
  await buildApi();
  endpointOutput();
  startApi();
  startWorker();
  startPassenger();
}

function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();

  if (process.platform !== 'win32') {
    child.kill('SIGTERM');
    return new Promise((resolve) => child.once('exit', resolve));
  }

  return new Promise((resolve) => {
    const taskkill = spawn('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    taskkill.once('error', () => resolve());
    taskkill.once('exit', () => resolve());
  });
}

async function shutdown() {
  await Promise.all(children.map(stopChild));
}

process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)));
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)));

main().catch((error) => {
  console.error(`HotPesa development startup failed: ${error.message}`);
  void shutdown().finally(() => process.exit(1));
});
