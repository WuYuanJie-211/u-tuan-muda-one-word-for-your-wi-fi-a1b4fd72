import fs from "node:fs";

const WORD = "Decorative";
const OUTPUT_PATH = "/output/entry.txt";

// Validate: single alphabetic word, at most 30 letters. Refuse otherwise.
if (typeof WORD !== "string" || WORD.length === 0 || WORD.length > 30) {
  console.error(`Invalid word: must be 1-30 characters, got length ${WORD.length}`);
  process.exit(1);
}
if (!/^[A-Za-z]+$/.test(WORD)) {
  console.error(`Invalid word: must contain only letters A-Z, got ${JSON.stringify(WORD)}`);
  process.exit(1);
}

// Write exactly the word and nothing else (no trailing newline).
fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync(OUTPUT_PATH, WORD, { encoding: "utf8" });

// World-readable output.
fs.chmodSync(OUTPUT_PATH, 0o644);

// Self-check: read the file back and verify byte-exact content and mode.
const readBack = fs.readFileSync(OUTPUT_PATH, { encoding: "utf8" });
if (readBack !== WORD) {
  console.error(
    `Self-check failed: file content ${JSON.stringify(readBack)} does not match word ${JSON.stringify(WORD)}`,
  );
  process.exit(1);
}
const mode = fs.statSync(OUTPUT_PATH).mode & 0o777;
if (mode !== 0o644) {
  console.error(`Self-check failed: file mode is ${mode.toString(8)}, expected 644`);
  process.exit(1);
}

console.log(`Wrote ${JSON.stringify(WORD)} to ${OUTPUT_PATH} (mode 0644, verified)`);
