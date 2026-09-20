# QVAC Revision Forge

QVAC Revision Forge is a small local AI study tool that turns raw study notes into a focused revision pack.

It runs AI inference directly on the device using Tether's QVAC SDK. No cloud AI API is used for generation.

## Features

* Paste raw study notes into a simple browser interface
* Generate a structured revision pack locally
* Extracts:

  * Core idea
  * Key concepts
  * Common mistake
  * 3 multiple-choice quiz questions
  * Answer key
* Uses QVAC for on-device AI inference
* CPU-friendly configuration
* Includes a Windows command-line quickstart
* No external AI API keys required

## QVAC SDK

This project uses:

```text
@qvac/sdk@0.19.1
```

The application uses the following QVAC functions:

* `loadModel()`
* `completion()`
* `unloadModel()`

The local model used by the application is:

```text
LLAMA_3_2_1B_INST_Q4_0
```

The model is configured to run locally on the CPU.

## How it works

```text
Study Notes
     |
     v
Revision Forge
     |
     v
QVAC loadModel()
     |
     v
QVAC completion()
     |
     v
Structured Revision Pack
     |
     v
Browser Display
```

The generation prompt instructs the local model to treat the supplied study notes as its source of truth and avoid intentionally adding information that is not present in the notes.

## Requirements

* Windows, macOS, or Linux
* Node.js 18+
* npm
* A machine capable of running the selected local QVAC model

## Installation

Clone the repository:

```cmd
git clone https://github.com/esmerenghoy497-cloud/qvac-revision-forge.git
cd qvac-revision-forge
```

Install dependencies:

```cmd
npm install
```

## Run

Start the local server:

```cmd
npm start
```

Then open:

```text
http://localhost:3000
```

## Command-line quickstart

Windows users can use the included quickstart script:

```cmd
quickstart.cmd
```

The script installs the npm dependencies and starts the local server automatically.

Then open:

```text
http://localhost:3000
```

Press `Ctrl+C` in the command window to stop the server.

## Example

Example study notes:

```text
Photosynthesis is the process plants use to convert light energy into chemical energy.
Chlorophyll absorbs light, mainly in the blue and red parts of the spectrum.
Carbon dioxide enters through stomata, while water is absorbed by the roots.
The light-dependent reactions produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to help build sugars.
Oxygen is released as a byproduct of splitting water.
```

Revision Forge turns notes like these into a compact revision pack containing:

```text
CORE IDEA

KEY CONCEPTS

COMMON MISTAKE

QUIZ

ANSWER KEY
```

## Source-focused generation

Revision Forge is designed around the supplied study material.

The application sends the notes to the local QVAC model with instructions to:

1. Treat the provided notes as the source of truth.
2. Use information from the notes when generating the revision pack.
3. Avoid intentionally adding unrelated outside facts.
4. Use `Not stated in the notes.` when the requested information cannot be supported by the provided material.

This makes the tool useful for turning a student's existing notes into revision material without sending the notes to a cloud AI service.

## Standalone CLI test

The QVAC generation logic can also be tested directly:

```cmd
node app.js
```

This runs a local generation test using the same QVAC model and inference flow.

## Project structure

```text
qvac-revision-forge/
├── app.js
├── server.js
├── index.html
├── quickstart.cmd
├── package.json
├── package-lock.json
├── LICENSE.txt
├── README.md
└── .gitignore
```

### Main files

**`server.js`**

Runs the local HTTP server and handles revision-pack generation requests.

**`app.js`**

Contains the standalone QVAC model-loading and completion flow.

**`index.html`**

Provides the browser interface for entering notes and viewing the generated revision pack.

**`quickstart.cmd`**

Provides a Windows command-line shortcut for installing dependencies and starting the application.

## Privacy

Study notes are processed by the local QVAC model running on the user's device.

The application does not require a cloud AI API key for inference.

## Limitations

Local model output can vary depending on the quality and amount of study material provided.

For better results, provide complete and specific notes rather than very short fragments.

The selected model is intentionally small enough for local experimentation, so its responses may be less capable than larger cloud-based models.

## License

This project is released under the MIT License.

## QVAC resources

* QVAC SDK
* QVAC documentation
* QVAC examples
* QVAC source repository

## Project status

This is an open-source QVAC SDK challenge project demonstrating local AI inference through a practical study workflow.
