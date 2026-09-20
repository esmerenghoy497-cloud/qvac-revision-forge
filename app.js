import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

import { readFile } from "node:fs/promises";

const file = process.argv[2];

if (!file) {
  console.error("Usage: npm run forge -- <notes-file>");
  process.exit(1);
}

let notes;

try {
  notes = await readFile(file, "utf8");
} catch (error) {
  console.error(`Could not read notes file: ${file}`);
  process.exit(1);
}

const cleanNotes = notes.trim();

if (!cleanNotes) {
  console.error("The notes file is empty.");
  process.exit(1);
}

if (cleanNotes.length < 120) {
  console.error(
    "Add more study notes first. Revision Forge needs enough source material."
  );
  process.exit(1);
}

console.log("QVAC Revision Forge");
console.log("===================");
console.log(`Source: ${file}`);
console.log("Loading local QVAC model...");

let modelId;

try {
  modelId = await loadModel({
    modelSrc: LLAMA_3_2B_INST_Q4_0,
    modelConfig: {
      ctx_size: 2048,
      device: "cpu",
      gpu_layers: 0
    }
  });

  console.log("Model loaded.");
  console.log("Generating revision pack...\n");

  const prompt = `
You are Revision Forge.

Return exactly:

CORE IDEA:
One short sentence based only on the source notes.

KEY CONCEPTS:
Up to 5 facts directly supported by the source notes.

COMMON MISTAKE:
One possible misunderstanding based only on the source notes.
If there is not enough information, write:
Not stated in the notes.

QUIZ:
Exactly 3 multiple-choice questions.
Each question must be answerable directly from the source notes.
Each question must have exactly 4 choices.
The correct choice must be directly supported by the source notes.
Do not test outside knowledge.

ANSWER KEY:
1. [letter]
2. [letter]
3. [letter]

Do not put the answers beside the quiz questions.

SOURCE NOTES:
${cleanNotes}
END SOURCE NOTES
`;

  const result = completion({
    modelId,
    history: [
      {
        role: "user",
        content: prompt
      }
    ],
    stream: true
  });

  let answer = "";

  for await (const token of result.tokenStream) {
    answer += token;
    process.stdout.write(token);
  }

  console.log("\n\nRevision pack generated locally by QVAC.");
} catch (error) {
  console.error("\nQVAC error:", error);
  process.exitCode = 1;
} finally {
  if (modelId) {
    await unloadModel({ modelId });
  }
}