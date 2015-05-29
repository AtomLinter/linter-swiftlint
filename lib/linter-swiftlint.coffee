module.exports = LinterSwiftlint =
  activate: ->
    console.log 'activate linter-swiftlint'# if atom.inDevMode()
    unless atom.packages.getLoadedPackages 'linter-plus'
      @showError '[Linter+ swiftlint] `linter-plus` package not found,
       please install it'

  showError: (message = '') ->
    atom.notifications.addError message

  provideLinter: ->
    {
      scopes: ['source.swift']
      lint: @lint
      lintOnFly: true
    }

  lint: (TextEditor) ->
    CP = require 'child_process'
    Path = require 'path'
    XRegExp = require('xregexp').XRegExp

    regex = XRegExp('(?<file>\\S+):(?<line>\\d+):(?<column>\\d+):
     ((?<error>error)|(?<warning>warning)): (?<message>.*)')

    return new Promise (Resolve) ->
      FilePath = TextEditor.getPath()
      return unless FilePath # Files that have not be saved
      Data = []
      Process = CP.exec("swiftlint lint #{TextEditor.getTitle()}",
        {cwd: Path.dirname(FilePath)})
      Process.stdout.on 'data', (data) -> Data.push(data.toString())
      Process.on 'close', ->
        Content = []
        for line in Data
          Content.push XRegExp.exec(line, regex)
        ToReturn = []
        Content.forEach (regex) ->
          if regex
            if regex.error
              ToReturn.push(
                Type: 'Error',
                Message: regex.message,
                File: regex.file
                Position: [[regex.line, regex.column], [regex.line, regex.column]]
              )
            if regex.warning
              ToReturn.push(
                Type: 'Warning',
                Message: regex.message,
                File: regex.file
                Position: [[regex.line, regex.column], [regex.line, regex.column]]
              )
        Resolve(ToReturn)
