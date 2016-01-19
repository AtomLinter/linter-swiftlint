module.exports =
  config:
    configurationPath:
      type: 'string'
      title: 'the path to SwiftLint\'s configuration file that relative to project or absolute'
      default: '.swiftlint.yml'
    swiftlintExecutablePath:
      type: 'string'
      title: 'the path to SwiftLint'
      default: '/usr/local/bin/swiftlint'

  activate: ->
    require('atom-package-deps').install('linter-swiftlint')

  provideLinter: ->
    helpers = require('atom-linter')
    path = require('path')
    fs = require('fs-plus')
    regex = '([^:]+):(?<line>\\d+):(?<col>\\d+)?:?\\s(?<type>\\w+):\\s(?<message>.*)'
    provider =
      grammarScopes: ['source.swift']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) ->
        filePath = textEditor.getPath()
        input = textEditor.getText()

        command = atom.config.get('linter-swiftlint.swiftlintExecutablePath')
        return unless fs.existsSync(command)
        parameters = ['lint', '--use-stdin']
        config = fs.normalize(atom.config.get('linter-swiftlint.configurationPath'))
        if not path.isAbsolute(config)
          config = atom.project.getDirectories()
            .filter (directory) -> directory.contains filePath
            .map (direcotory) -> direcotory.getFile(config).getPath()
            .find -> true # take first item if exists

        parameters = parameters.concat ["--config", config] if config and fs.existsSync(config)
        options = {stdin: input, throwOnStdErr: false}
        helpers.exec(command, parameters, options).then (output) ->
          helpers.parse(output, regex, {filePath: filePath})
