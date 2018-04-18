import { LinterProvider } from "atom/linter";

// TypeScript apparently has absolutely zero support for technologies marked
// experimental, so this has to be declared manually.
// https://github.com/Microsoft/TypeScript/issues/21309
type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

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
