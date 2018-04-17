import helpers = require("atom-linter");
import path = require("path");
import fs = require("fs");
import { TextEditor } from "atom";
import { LintResult, LinterProvider } from "atom/linter";

const regex =
  "([^:]+):(?<line>\\d+):(?<col>\\d+)?:?\\s(?<type>\\w+):\\s(?<message>.*)";

const provider: LinterProvider = {
  name: "SwiftLint",
  grammarScopes: ["source.swift"],
  scope: "file",
  lintsOnChange: true,
  lint: async (textEditor: TextEditor): Promise<LintResult> => {
    const filePath = textEditor.getPath();
    const input = textEditor.getText();

    const command = atom.config.get("linter-swiftlint.swiftlintExecutablePath");
    if (!fs.existsSync(command)) {
      return null;
    }

    let parameters = ["lint", "--use-stdin"];
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
      parameters = parameters.concat(["--config", config]);
    }

    const additionalOptions = atom.config.get(
      "linter-swiftlint.additionalOptions"
    );
    if (additionalOptions) {
      parameters = parameters.concat(additionalOptions);
    }

    const options = {
      ignoreExitCode: true,
      stdin: input,
      throwOnStderr: false
    };

    const output = await helpers.exec(command, parameters, options);

    return helpers.parse(output, regex, { filePath: filePath });
  }
};

module.exports = provider;
