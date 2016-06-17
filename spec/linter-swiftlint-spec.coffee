describe 'The swiftlint provider for Linter', ->
  lint = require('../lib/init').provideLinter().lint

  beforeEach ->
    atom.workspace.destroyActivePaneItem()
    waitsForPromise ->
      return atom.packages.activatePackage('linter-swiftlint')

  it 'should be in the packages list', ->
    return expect(atom.packages.isPackageLoaded('linter-swiftlint')).toBe true

  it 'should be an active package', ->
    return expect(atom.packages.isPackageActive('linter-swiftlint')).toBe true

  it 'finds nothing wrong with a well formed file', ->
    waitsForPromise ->
      return atom.workspace.open(__dirname + '/fixtures/well-formed.swift').then (editor) ->
        return lint(editor).then (messages) ->
          expect(messages.length).toEqual 0

  it 'finds something wrong with a not well formed file', ->
    waitsForPromise ->
      return atom.workspace.open(__dirname + '/fixtures/not-well-formed.swift').then (editor) ->
        return lint(editor).then (messages) ->
          expect(messages.length).toEqual 1
          expect(messages[0].range).toEqual [[2, 0], [2, 0]]
