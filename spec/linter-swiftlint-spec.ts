describe("The swiftlint provider for Linter", () => {
  const { lint } = require("../src/index").provideLinter();

  beforeEach(async () => {
    await atom.packages.activatePackage("linter-swiftlint");
  });

  it("should be in the packages list", () => {
    expect(atom.packages.isPackageLoaded("linter-swiftlint")).toBe(true);
  });

  it("should be an active package", () => {
    expect(atom.packages.isPackageActive("linter-swiftlint")).toBe(true);
  });

  it("finds nothing wrong with a well formed file", async () => {
    const editor = await atom.workspace.open(
      __dirname + "/fixtures/well-formed.swift"
    );
    const messages = await lint(editor);

    expect(messages).toMatchSnapshot();
  });

  it("finds something wrong with a not well formed file", async () => {
    const editor = await atom.workspace.open(
      __dirname + "/fixtures/not-well-formed.swift"
    );
    const messages = await lint(editor);

    expect(messages).toMatchSnapshot();
  });
});
