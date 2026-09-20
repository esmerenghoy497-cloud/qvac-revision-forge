import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

const notes = `
Photosynthesis is the process plants use to convert light energy into chemical energy.
Chlorophyll absorbs light, mainly in the blue and red parts of the spectrum.
Carbon dioxide enters through stomata, while water is absorbed by the roots.
The light-dependent reactions produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to help build sugars.
Oxygen is released as a byproduct of splitting water.
`;

async function main() {
  console.log("QVAC Revision Forge");
  console.log("Loading local model...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelConfig: {
      ctx_size: 2048,
      device: "cpu",
      gpu_layers: 0
    }
  });

  console.log("Model loaded.");

  const prompt = `
You are Revision Forge, a study-material generator.

Transform the student's notes below into a compact revision pack.

Return exactly these sections:

CORE IDEA:
KEY CONCEPTS:
COMMON MISTAKE:
QUIZ:
ANSWER KEY:

Keep the answer clear and suitable for a high school student.
Only use information supported by the notes.
Do not invent facts or add unsupported details.
Create exactly 3 quiz questions.
Each question must have exactly 4 choices.
Put the correct answer in the ANSWER KEY section only.
Do not test information that is not explicitly stated in the notes.
Do not use outside knowledge to create quiz questions.

Student notes:
${notes}
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

  console.log("\\n");
  console.log("Revision pack generated locally by QVAC.");

  await unloadModel({ modelId });
}

main().catch((error) => {
  console.error("QVAC error:", error);
  process.exit(1);
});