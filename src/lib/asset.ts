// Cache-busting: qkix.eu sits behind a CDN that keeps files for hours under the same URL, so every
// image / video the pages link gets ?v=<hash of its content> - a new file is a new URL at once.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(process.cwd(), "public");
const hash = (data: Buffer) => createHash("md5").update(data).digest("hex").slice(0, 8);

/** "/inchway/icon.png" -> "/inchway/icon.png?v=1a2b3c4d" (unchanged when the file isn't there). */
export function asset(path: string): string {
  const file = join(PUBLIC, path);
  return existsSync(file) ? `${path}?v=${hash(readFileSync(file))}` : path;
}

/** One version for a whole folder (the diorama's sprites). */
export function folderVersion(dir: string): string {
  const d = join(PUBLIC, dir);
  return hash(Buffer.concat(readdirSync(d).sort().map((f) => readFileSync(join(d, f)))));
}
