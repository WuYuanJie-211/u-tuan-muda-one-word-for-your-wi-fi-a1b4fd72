import * as fs from "fs";

// One Word for Your Wi-Fi — the winning word.
// Full bars, nothing loads: the signal is there, the internet is not.
const word = "Mirage";

// Gate check: the competition takes exactly one word — no spaces,
// no punctuation, no extra lines. Refuse to write anything else.
if (!/^[A-Za-z]+$/.test(word)) {
  throw new Error("entry must be a single word, got: " + word);
}

fs.writeFileSync("/output/entry.txt", word);
fs.chmodSync("/output/entry.txt", 0o644);
