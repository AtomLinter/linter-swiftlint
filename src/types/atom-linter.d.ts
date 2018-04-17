declare module "atom-linter" {
  import { Message } from "atom/linter";
  import { TextEditor } from "atom";

  export const FindCache: Map<any, any>;

  export function exec(
    command: String,
    args: Array<string>,
    options: Object
  ): Promise<String>;

  export function execNode<T>(
    filePath: String,
    args: Array<string>,
    options: Object
  ): Promise<T>;

  export function parse(
    data: String,
    regex: String,
    options: Object
  ): Array<Message>;

  export function generateRange<T>(
    textEditor: TextEditor,
    lineNumber: Number,
    colStart: Number
  ): Array<T>;

  export function find(
    directory: String,
    names: String | Array<string>
  ): String | null;

  export function findCached(
    directory: String,
    names: String | Array<string>
  ): String | null;

  export function findAsync(
    directory: String,
    names: String | Array<string>
  ): Promise<String | null>;

  export function findCachedAsync(
    directory: String,
    names: String | Array<string>
  ): Promise<String | null>;

  export function tempFile<T>(
    fileName: String,
    fileContents: String,
    callback: Function
  ): Promise<T>;

  export function tempFiles<T>(
    filesNames: Array<{ name: String; contents: String }>,
    callback: Function
  ): Promise<T>;
}
