import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

let cached: { key: Buffer; cert: Buffer } | undefined;

// testServerTls returns a localhost certificate for the HTTPS test server.
// The private key is written under a temp directory and removed before this
// returns. Do not commit a server key to the repository instead.
export function testServerTls(): { key: Buffer; cert: Buffer } {
  if (cached) {
    return cached;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bucketeer-node-sdk-'));
  const keyPath = path.join(dir, 'server.key');
  const certPath = path.join(dir, 'server.crt');
  try {
    try {
      execFileSync(
        'openssl',
        [
          'req',
          '-x509',
          '-newkey',
          'rsa:2048',
          '-nodes',
          '-keyout',
          keyPath,
          '-out',
          certPath,
          '-days',
          '1',
          '-subj',
          '/CN=localhost',
        ],
        { stdio: ['ignore', 'ignore', 'pipe'] },
      );
    } catch (error) {
      const stderr =
        error instanceof Error && 'stderr' in error
          ? String((error as { stderr?: Buffer }).stderr ?? '')
          : '';
      throw new Error(
        `failed to generate a test certificate with openssl: ${stderr || error}`,
      );
    }
    cached = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    return cached;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
