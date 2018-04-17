import { LinterProvider } from "atom/linter";

class SwiftLintLinter {
  public activate(): void {
    require("atom-package-deps").install("linter-swiftlint");
  }

  public provideLinter(): LinterProvider {
    return require("./linter-provider");
  }
}

module.exports = new SwiftLintLinter();
