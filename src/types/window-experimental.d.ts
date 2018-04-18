// TypeScript has absolutely zero support for technologies marked
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

declare interface Window {
  requestIdleCallback: ((
    callback: ((deadline: RequestIdleCallbackDeadline) => void),
    opts?: RequestIdleCallbackOptions,
  ) => RequestIdleCallbackHandle);
  cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
}
