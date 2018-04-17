declare module "atom-linter" {
  import { Message } from "atom/linter";
  import { TextEditor, Range } from "atom";

  export const FindCache: Map<any, any>;

  export function exec(
    command: string,
    args: Array<string>,
    options: Object
  ): Promise<string>;

  export function execNode<T>(
    filePath: string,
    args: Array<string>,
    options: Object
  ): Promise<T>;

  export function parse(
    data: string,
    regex: string,
    options: object
  ): Array<Message>;

  export function generateRange<T>(
    textEditor: TextEditor,
    lineNumber: number,
    colStart: number
  ): Array<Range>;

  export function find(
    directory: string,
    names: string | Array<string>
  ): string | null;

  export function findCached(
    directory: string,
    names: string | Array<string>
  ): string | null;

  export function findAsync(
    directory: string,
    names: string | Array<string>
  ): Promise<string | null>;

  export function findCachedAsync(
    directory: string,
    names: string | Array<string>
  ): Promise<string | null>;

  export function tempFile<T>(
    fileName: string,
    fileContents: string,
    callback: Function
  ): Promise<T>;

  export function tempFiles<T>(
    filesNames: Array<{ name: string; contents: string }>,
    callback: Function
  ): Promise<T>;
}
