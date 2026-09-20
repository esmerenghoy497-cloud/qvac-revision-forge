import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(
      path.join(__dirname, "index.html"),
      "utf8"
    );

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(html);
    return;
  }

  if (req.method === "POST" && req.url === "/generate") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { notes } = JSON.parse(body);
        const cleanNotes = notes?.trim() || "";

        if (!cleanNotes) {
          res.writeHead(400, {
            "Content-Type": "application/json"
          });

          res.end(JSON.stringify({
            error: "Please enter your study notes first."
          }));

          return;
        }

        if (cleanNotes.length < 120) {
          res.writeHead(400, {
            "Content-Type": "application/json"
          });

          res.end(JSON.stringify({
            error:
              "Add more study notes first. Revision Forge needs enough source material to create a reliable revision pack."
          }));

          return;
        }

        console.log("Loading local QVAC model...");

        const modelId = await loadModel({
          modelSrc: LLAMA_3_2_1B_INST_Q4_0,
          modelConfig: {
            ctx_size: 2048,
            device: "cpu",
            gpu_layers: 0
          }
        });

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

When possible, reuse the wording from the source notes.

If something cannot be answered from the source notes, write:
Not stated in the notes.

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
        }

        await unloadModel({ modelId });

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          result: answer
        }));

        console.log("Revision pack generated locally by QVAC.");
      } catch (error) {
        console.error("QVAC error:", error);

        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: "QVAC could not generate the revision pack."
        }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Revision Forge running at http://localhost:${PORT}`);
});