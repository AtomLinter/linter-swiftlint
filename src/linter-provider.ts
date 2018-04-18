import * as helpers from "atom-linter";
import * as path from "path";
import * as fs from "fs";
import { TextEditor, Range } from "atom";
import { LintResult, LinterProvider, Message } from "atom/linter";

const regex = /(?:[^:]+):(\d+):(\d+)?:?\s(\w+):\s(.*)/;

const provider: LinterProvider = {
  name: "SwiftLint",
  grammarScopes: ["source.swift"],
  scope: "file",
  lintsOnChange: true,
  lint: async (textEditor: TextEditor): Promise<LintResult> => {
    const filePath = textEditor.getPath();

    if (!filePath) {
      // The current TextEditor has no path associated with it.
      return null;
    }

    const input = textEditor.getText();

    const command = atom.config.get("linter-swiftlint.swiftlintExecutablePath");
    if (!fs.existsSync(command)) {
      return null;
    }

    const parameters = ["lint", "--use-stdin"];
    let config = path.normalize(
      atom.config.get("linter-swiftlint.configurationPath")
    );

    if (filePath && !path.isAbsolute(config)) {
      config =
        atom.project
          .getDirectories()
          .filter(directory => directory.contains(filePath))
          .map(directory => directory.getFile(config).getPath())
          .find(() => true) || config; // take first item if exists
    }

    if (config && fs.existsSync(config)) {
      parameters.push("--config", config);
    }

    const additionalOptions = atom.config.get(
      "linter-swiftlint.additionalOptions"
    );
    if (additionalOptions) {
      parameters.push(additionalOptions);
    }

    const options = {
      ignoreExitCode: true,
      stdin: input,
      throwOnStderr: false
    };

    const output = await helpers.exec(command, parameters, options);

    const messages: Message[] = [];
    let match = regex.exec(output);
    while (match !== null) {
      const line = Math.max(Number.parseInt(match[1], 10) - 1, 0);
      const col = Math.max(Number.parseInt(match[2], 10) - 1, 0);
      let position: Range;
      try {
        position = helpers.generateRange(textEditor, line, col);
      } catch(e) {
        // If the position wasn't valid, just return the start of the file
        // NOTE: Ideally this would handle the error and give the user an easy
        // way to report it for eventual fixing.
        position = new Range([0, 0], [0, Number.POSITIVE_INFINITY]);
      }

      const type = match[3].toLowerCase();
      const severity =
        type === 'error' || type === 'warning' || type === 'info' ?
        type : 'error';

      messages.push({
        severity,
        excerpt: match[3],
        location: {
          file: filePath,
          position,
        }
      });
    }

    return messages;
  }
};

module.exports = provider;
