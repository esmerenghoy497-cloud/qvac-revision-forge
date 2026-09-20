# QVAC Revision Forge

QVAC Revision Forge is a local AI study tool that turns raw study notes into a structured revision pack.

It uses Tether's QVAC SDK to run AI inference directly on the user's device. Instead of sending study notes to a cloud AI service, the application loads a local language model and generates the revision material on-device.

## Features

Revision Forge generates:

* **Core Idea** — a short summary of the main idea
* **Key Concepts** — important points from the supplied notes
* **Common Mistake** — a possible misunderstanding based on the notes
* **Quiz** — exactly three multiple-choice questions
* **Answer Key** — the correct choices for the quiz

The application is designed around a source-focused workflow: the user's notes are provided as the source material for the generated revision pack.

## QVAC SDK

This project uses:

```text
@qvac/sdk@0.19.1
```

The application directly uses these QVAC SDK functions:

```js
loadModel()
completion()
unloadModel()
```

### Local model

Revision Forge uses:

```js
LLAMA_3_2_1B_INST_Q4_0
```

The model is configured for local CPU inference:

```js
modelConfig: {
  ctx_size: 2048,
  device: "cpu",
  gpu_layers: 0
}
```

No cloud AI API is used for the generation process.

## How It Works

The application follows this flow:

```text
Study Notes
     ↓
Browser Interface
     ↓
Local Node.js Server
     ↓
QVAC loadModel()
     ↓
QVAC completion()
     ↓
Generated Revision Pack
     ↓
Browser
     ↓
QVAC unloadModel()
```

The browser sends the study notes to the local server. The server loads the QVAC model, generates the revision pack locally, unloads the model, and returns the result to the browser.

## Requirements

* Node.js
* npm
* A computer capable of running the selected QVAC local model

## Installation

Clone the repository:

```bash
git clone https://github.com/esmerenghoy497-cloud/qvac-revision-forge.git
```

Enter the project directory:

```bash
cd qvac-revision-forge
```

Install the dependencies:

```bash
npm install
```

The main QVAC dependency installed by the project is:

```text
@qvac/sdk@0.19.1
```

You can verify the installed version with:

```bash
npm list @qvac/sdk
```

## Running the Application

Start the local server:

```bash
npm start
```

The server should display:

```text
Revision Forge running at http://localhost:3000
```

Open the application in your browser:

```text
http://localhost:3000
```

## Using Revision Forge

### 1. Enter your notes

Paste your study material into the **Your study notes** field.

Example:

```text
Photosynthesis is the process plants use to convert light energy into chemical energy.
Chlorophyll absorbs light, mainly in the blue and red parts of the spectrum.
Carbon dioxide enters through stomata, while water is absorbed by the roots.
The light-dependent reactions produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to help build sugars.
Oxygen is released as a byproduct of splitting water.
```

### 2. Generate the revision pack

Click:

**Forge Revision Pack**

The local server receives the notes and passes them to the QVAC-powered generation process.

### 3. Review the result

The generated revision pack appears in the right-hand panel.

It contains the core idea, key concepts, common mistake, quiz questions, and answer key.

## Source-Focused Generation

Revision Forge is designed to use the supplied notes as its source material.

The generation instructions tell the local model to avoid intentionally introducing outside information and to create quiz questions that can be answered from the supplied notes.

The application also requires a minimum amount of source material before generation. This helps prevent extremely short inputs from being treated as complete study material.

Because the application uses a relatively small local model, users should still review generated material before relying on it for important study or assessment.

## Standalone QVAC Test

The project also includes `app.js`, which provides a command-line test of the QVAC integration.

Run:

```bash
node app.js
```

This verifies that the application can:

1. Load the local QVAC model
2. Run a text completion
3. Stream the generated response
4. Unload the model

## Project Structure

```text
qvac-revision-forge/
├── app.js
├── server.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── .gitignore
```

### Files

**`app.js`**

Standalone QVAC test demonstrating local model loading and completion.

**`server.js`**

Runs the local HTTP server and connects the browser interface to the QVAC SDK.

**`index.html`**

Contains the Revision Forge browser interface.

**`package.json`**

Contains the project metadata, scripts, and QVAC SDK dependency.

**`LICENSE`**

MIT open-source license.

## Privacy

Study notes are processed by the local application and passed to the locally loaded QVAC model.

Revision Forge does not require a cloud AI API key and does not use a remote AI completion endpoint for generating the revision pack.

## Limitations

The application uses a small local language model so that inference can run on a personal computer.

Local models can sometimes produce incorrect wording, formatting, or interpretations. Generated revision material should therefore be reviewed by the user.

Revision Forge is a study aid and is not intended to replace official course materials, textbooks, or teacher guidance.

## License

This project is licensed under the MIT License.

See the `LICENSE` file for the complete license text.

## QVAC Resources

* QVAC GitHub: https://github.com/tetherto/qvac
* QVAC SDK releases: https://github.com/tetherto/qvac/releases
* QVAC SDK on npm: https://www.npmjs.com/package/@qvac/sdk

## Project Status

QVAC Revision Forge is a challenge project demonstrating a practical application built around local QVAC inference.

Its goal is simple: turn existing study notes into a focused revision pack without relying on a cloud AI generation service.
