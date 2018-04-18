import { LinterProvider } from "atom/linter";

// Internal variables
const idleCallbacks = new Set();

const makeIdleCallback = (work: () => void) => {
  let callbackId: RequestIdleCallbackHandle;
  const callBack = () => {
    idleCallbacks.delete(callbackId)
    work()
  }
  callbackId = window.requestIdleCallback(callBack)
  idleCallbacks.add(callbackId)
}

class SwiftLintLinter {
  private static installPeers() {
    require("atom-package-deps").install("linter-swiftlint");
  }

  public activate(): void {
    if (!atom.inSpecMode()) {
      makeIdleCallback(SwiftLintLinter.installPeers);
    }
  }

  public provideLinter(): LinterProvider {
    return require("./linter-provider");
  }
}

module.exports = new SwiftLintLinter();
