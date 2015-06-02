module.exports = LinterSwiftlint =
  activate: ->
    console.log 'activate linter-swiftlint' if atom.inDevMode()
    unless atom.packages.getLoadedPackages 'linter-plus'
      @showError '[Linter+ swiftlint] `linter-plus` package not found,
       please install it'

  showError: (message = '') ->
    atom.notifications.addError message

  provideLinter: ->
    {
      scopes: ['source.swift']
      scope: 'file'
      lint: @lint
      lintOnFly: false
    }

  lint: (TextEditor, TextBuffer) ->
    CP = require 'child_process'
    Path = require 'path'
    XRegExp = require('xregexp').XRegExp

    regex = XRegExp(':(?<line>\\d+): ((?<error>error)|(?<warning>warning)): (?<message>.*)')

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
          console.log "linter-swiftlint: #{line}" if atom.inDevMode()
        ToReturn = []
        Content.forEach (regex) ->
          if regex
            if regex.error
              ToReturn.push(
                type: 'error',
                message: regex.message,
                file: FilePath
                position: [
                  [regex.line, 0],
                  [regex.line, TextBuffer.lineLengthForRow(regex.line)]
                ]
              )
            if regex.warning
              ToReturn.push(
                type: 'warning',
                message: regex.message,
                file: FilePath
                position: [
                  [regex.line, 0],
                  [regex.line, TextBuffer.lineLengthForRow(regex.line)]
                ]
              )
        Resolve(ToReturn)
