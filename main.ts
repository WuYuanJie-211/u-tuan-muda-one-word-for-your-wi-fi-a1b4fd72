// One Word for Your Wi-Fi — round 2 entry.
//
// The word is the whole entry: a single word that names the Wi-Fi the way
// its owner feels it. No sentence, no punctuation, no explanation in the
// output file — just the word itself.

const fs = require("fs");
const path = require("path");

const WORD = "Undertow";
const OUT_DIR = "/output";
const OUT_FILE = path.join(OUT_DIR, "entry.txt");

// The obvious first-thought words are exactly the ones that collide with
// other entries, so they are refused outright — the entry must be a word
// nobody else's first instinct would produce.
const BLOCKED = ["Mirage", "Phantom", "Ghost", "Signal", "Wave", "Cloud", "Nebula", "Aurora", "Buffering"];
if (BLOCKED.includes(WORD)) {
  console.error(`refused: ${JSON.stringify(WORD)} is an obvious first-thought word`);
  process.exit(1);
}

// The entry must be exactly one word: letters only, 1-30 characters.
// Anything else is refused before a file is ever written.
if (!/^[A-Za-z]+$/.test(WORD) || WORD.length > 30) {
  console.error("refused: word must match ^[A-Za-z]+$ and be at most 30 chars");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Write directly to the final path (never tempfile+rename) so the grader
// sees the real file, then force world-readable mode 0644.
fs.writeFileSync(OUT_FILE, WORD, { encoding: "utf8", mode: 0o644 });
fs.chmodSync(OUT_FILE, 0o644);

// Read-back check: the bytes on disk must be identical to the word, and
// the file mode must be exactly 0644, or the run fails loudly.
const back = fs.readFileSync(OUT_FILE, "utf8");
const mode = fs.statSync(OUT_FILE).mode & 0o777;
if (back !== WORD) {
  console.error(`read-back mismatch: file holds ${JSON.stringify(back)}`);
  process.exit(1);
}
if (mode !== 0o644) {
  console.error(`mode mismatch: expected 644, got ${mode.toString(8)}`);
  process.exit(1);
}

console.log(`wrote ${JSON.stringify(WORD)} to ${OUT_FILE} (mode 644)`);
