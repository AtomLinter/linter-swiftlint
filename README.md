linter-swiftlint
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to SwiftLint's styling advice. Used with files that have the `Swift` syntax.

## Installation

As well, install [SwiftLint](https://github.com/realm/SwiftLint).

### Plugin installation
```
$ apm install linter-swiftlint
```

## Settings
You can configure linter-swiftlint by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```cson
  "linter-swiftlint":
    configurationPath: ".swiftlint.yml"
    swiftlintExecutablePath: "/usr/local/bin/swiftlint"
```

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass coffeelint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!
