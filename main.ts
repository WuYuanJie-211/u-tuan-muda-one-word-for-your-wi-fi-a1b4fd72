import fs from "node:fs";

const WORD = "Decorative";
const OUTPUT_PATH = "/output/entry.txt";

// Validate: single alphabetic word, at most 30 letters. Refuse otherwise.
// "Decorative" fits this competition's one-word brief: it names the
// quality of a Wi-Fi name that is chosen to be seen and admired, not
// merely to identify a network.
if (typeof WORD !== "string" || WORD.length === 0 || WORD.length > 30) {
  console.error(`Invalid word: must be 1-30 letters, got length ${WORD.length}`);
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
// Kept as its own named step so a failed verification points at the
// exact check that caught it instead of a generic write error.
function verifyOutput(path: string, expectedWord: string): void {
  const readBack = fs.readFileSync(path, { encoding: "utf8" });
  if (readBack !== expectedWord) {
    console.error(
      `Self-check failed: file content ${JSON.stringify(readBack)} does not match word ${JSON.stringify(expectedWord)}`,
    );
    process.exit(1);
  }
  const mode = fs.statSync(path).mode & 0o777;
  if (mode !== 0o644) {
    console.error(`Self-check failed: file mode is ${mode.toString(8)}, expected 644`);
    process.exit(1);
  }
}

verifyOutput(OUTPUT_PATH, WORD);

console.log(`Wrote ${JSON.stringify(WORD)} to ${OUTPUT_PATH} (mode 0644, verified)`);
