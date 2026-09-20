import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

console.log("");
console.log("QVAC Revision Forge");
console.log("===================");
console.log("");
console.log("Paste your study notes below.");
console.log("Type EXIT on its own line when finished.");
console.log("");

const lines = [];

rl.prompt();

rl.on("line", (line) => {
  if (line.trim().toUpperCase() === "EXIT") {
    rl.close();
    return;
  }

  lines.push(line);
  rl.prompt();
});

rl.on("close", async () => {
  const cleanNotes = lines.join("\n").trim();

  if (!cleanNotes) {
    console.error("\nNo study notes were entered.");
    process.exit(1);
  }

  if (cleanNotes.length < 120) {
    console.error(
      "\nAdd more study notes first. Revision Forge needs enough source material."
    );
    process.exit(1);
  }

  let modelId;

  try {
    console.log("\nLoading local QVAC model...");

    modelId = await loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
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

Your task is to reorganize the student's notes into a revision pack.

SOURCE-ONLY RULE:
The text between SOURCE NOTES and END SOURCE NOTES is the complete
source of truth.

Use ONLY information explicitly written in the source notes.

Do not use your training knowledge.
Do not add facts.
Do not add examples.
Do not add definitions.
Do not add scientific knowledge.
Do not correct the notes using outside knowledge.

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

    for await (const token of result.tokenStream) {
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
});