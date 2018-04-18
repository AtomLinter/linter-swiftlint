import { LinterProvider } from "atom/linter";

// Internal variables
const idleCallbacks = new Set();

const makeIdleCallback = (work: any) => {
  let callbackId: RequestIdleCallbackHandle;
  const callBack = () => {
    idleCallbacks.delete(callbackId)
    work()
  }
  callbackId = window.requestIdleCallback(callBack)
  idleCallbacks.add(callbackId)
}

class SwiftLintLinter {
  public activate(): void {
    const linterSwiftLintInstallPeerPackages = () => {
      require("atom-package-deps").install("linter-swiftlint");
    }
    if (!atom.inSpecMode()) {
      makeIdleCallback(linterSwiftLintInstallPeerPackages);
    }
  }

  public provideLinter(): LinterProvider {
    return require("./linter-provider");
  }
}

module.exports = new SwiftLintLinter();
