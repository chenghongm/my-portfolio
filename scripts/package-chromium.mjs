import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const nodeRequire = createRequire(import.meta.url);
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const chromiumEntry = nodeRequire.resolve('@sparticuz/chromium');
const chromiumBin = join(dirname(dirname(chromiumEntry)), 'bin');
const publicDirectory = join(projectRoot, 'public');
const archivePath = join(publicDirectory, 'chromium-pack.tar');

if (!existsSync(chromiumBin)) {
  console.log('Chromium binaries are unavailable; skipping archive creation.');
  process.exit(0);
}

mkdirSync(publicDirectory, { recursive: true });
execFileSync('tar', ['-cf', archivePath, '-C', chromiumBin, '.'], { stdio: 'inherit' });
console.log(`Created ${archivePath}`);
