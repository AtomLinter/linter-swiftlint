linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
path = require 'path'

module.exports = class LinterSwiftlint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.swift']
  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'swiftlint lint'
  linterName: 'swiftlint'
  errorStream: 'stdout'
  # A regex pattern used to extract information from the executable's output.
  # Beacuse swiftc is essentially a specialized clang, I am using the regex from
  #   from linter-clang.
  regex: '.+:(?<line>\\d+): ((?<error>error)|(?<warning>warning)): ' +
    '(?<message>.*)'

  constructor: (editor) ->
    super(editor)
    @listen = atom.config.observe 'linter-swiftlint.liveLinting', (value) =>
      @lintLive = value

  lintFile: (filePath, callback) ->
    if @lintLive
      file = (path.basename do @editor.getPath)
    else
      file = filePath
    # add file to regex to filter output to this file,
    # need to change filename a bit to fit into regex
    @regex = file.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") +
      ':(?<line>\\d+): ((?<error>error)|(?<warning>warning)): (?<message>.*)'
    super(file, callback)
    console.log "linter-swiftlint: command = #{@cmd}" if atom.inDevMode()

  destroy: ->
    @listen.dispose()

module.exports = LinterSwiftlint
