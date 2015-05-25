module.exports =
  config:
    liveLinting:
      type: 'boolean'
      default: true

  activate: ->
    console.log 'activate linter-swiftlint' if atom.inDevMode()
