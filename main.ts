// news-image-20261120 round 3 — entrypoint (Node 22, standard library only).
//
// The entry is the rendered front page beside this file. The program checks
// it before copying: it must be a real PNG, exactly 1024x1024, and at most
// 1 MiB. Only then is it copied byte for byte to the grader's output
// directory as entry.png. A bad render fails loudly instead of shipping
// a broken image.
//
// Run locally the same way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const entryPath = join(root, 'entry.png');

const MAX_BYTES = 1024 * 1024;
const EXPECTED_SIDE = 1024;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// A PNG starts with an 8-byte signature, then the IHDR chunk whose first
// 8 payload bytes are the width and height as big-endian uint32 values.
function readPngHeader(buf) {
  if (buf.length < 33) {
    throw new Error(`entry.png is too short to be a PNG: ${buf.length} bytes`);
  }
  const signature = Buffer.from(PNG_SIGNATURE);
  if (!buf.subarray(0, 8).equals(signature)) {
    throw new Error(`not a PNG file: ${entryPath}`);
  }
  if (buf.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`PNG without an IHDR chunk first: ${entryPath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function checkEntry(buf) {
  const { width, height } = readPngHeader(buf);
  if (width !== EXPECTED_SIDE || height !== EXPECTED_SIDE) {
    throw new Error(
      `entry.png must be 1024x1024, got ${width}x${height}`,
    );
  }
  if (buf.length > MAX_BYTES) {
    throw new Error(
      `entry.png must be at most 1 MiB, got ${buf.length} bytes`,
    );
  }
  return { width, height };
}

function main() {
  const bytes = readFileSync(entryPath);
  const { width, height } = checkEntry(bytes);
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, 'entry.png');
  copyFileSync(entryPath, dest);
  const copied = statSync(dest).size;
  if (copied !== bytes.length) {
    throw new Error(
      `copy mismatch: wrote ${copied} bytes, expected ${bytes.length}`,
    );
  }
  console.log(`entry.png ${width}x${height} ${bytes.length} bytes -> ${dest}`);
}

main();
