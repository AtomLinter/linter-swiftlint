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

    regex = XRegExp('(?<file>.+):(?<line>\\d+):\\s(?<type>\\w+):\\s(?<message>.*)')

    return new Promise (Resolve) ->
      FilePath = TextEditor.getPath()
      return unless FilePath # Files that have not be saved
      Data = []
      Process = CP.exec("swiftlint lint",
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
            console.log "linter-swiftlint file: #{regex.file}" if atom.inDevMode()
            console.log "linter-swiftlint line: #{regex.line}" if atom.inDevMode()
            console.log "linter-swiftlint type: #{regex.type}" if atom.inDevMode()
            console.log "linter-swiftlint message: #{regex.message}" if atom.inDevMode()
            ToReturn.push(
              type: regex.type,
              message: regex.message,
              file: regex.file
              position: [
                [regex.line, 0],
                [regex.line, 0]
              ]
            )
        Resolve(ToReturn)
