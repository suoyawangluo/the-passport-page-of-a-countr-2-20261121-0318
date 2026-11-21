// The Passport Page of a Country That Isn't There: the entry driver.
// The harness runs `node /bot/main.ts` (Node 22) with no network; /bot is read-only
// and /output is writable. Outside a container MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /bot and /output.
import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const src = join(BOT_DIR, 'entry.png');
const dst = join(OUTPUT_DIR, 'entry.png');
copyFileSync(src, dst);

// Check the output landed before the run ends: the copy must be a non-empty file
// byte-identical to the source image.
const outStat = statSync(dst);
if (!outStat.isFile() || outStat.size === 0) {
  throw new Error('entry.png was not written');
}
const srcHash = createHash('sha256').update(readFileSync(src)).digest('hex');
const dstHash = createHash('sha256').update(readFileSync(dst)).digest('hex');
if (srcHash !== dstHash) {
  throw new Error('entry.png copy differs from source');
}
console.log(`copied entry.png -> ${dst} (${outStat.size} bytes, sha256 ${dstHash})`);
