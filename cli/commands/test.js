const { resolve } = require('path');

exports.command = 'test [settings] [filter]'
exports.aliases = ['t']
exports.nargs = 1
exports.desc = 'Execute batpad tests'
exports.builder = {
  settings: {
    default: 'settings.json'
  }
}
exports.handler = function (argv) {
  require(resolve('./core/testRunner')).runTests(argv.settings, argv.filter)
}