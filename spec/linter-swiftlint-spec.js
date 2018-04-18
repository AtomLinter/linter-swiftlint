describe("The swiftlint provider for Linter", () => {
  const { lint } = require("../src/index").provideLinter();

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(async () => {
      await atom.packages.activatePackage("linter-swiftlint");
    });
  });

  it("should be in the packages list", () => {
    expect(atom.packages.isPackageLoaded("linter-swiftlint")).toBe(true);
  });

  it("should be an active package", () => {
    expect(atom.packages.isPackageActive("linter-swiftlint")).toBe(true);
  });

  it("finds nothing wrong with a well formed file", () => {
    waitsForPromise(async () => {
      const editor = await atom.workspace.open(
        __dirname + "/fixtures/well-formed.swift"
      );
      const messages = await lint(editor);

      expect(messages.length).toEqual(0);
    });
  });

  it("finds something wrong with a not well formed file", () =>
    waitsForPromise(async () => {
      const editor = await atom.workspace.open(
        __dirname + "/fixtures/not-well-formed.swift"
      );
      const messages = await lint(editor);

      expect(messages.length).toEqual(1);
      expect(messages[0].location.position).toEqual([[2, 0], [2, 3]]);
    }));
});
