const { join, resolve } = require('path');

exports.command = 'test [settings] [filter]'
exports.aliases = ['t']
exports.nargs = 1
exports.desc = 'Execute batpad tests'
exports.builder = {}
exports.handler = (argv) => {
  require(join(__dirname, '../../core/testRunner')).runTests(argv.filter)
}