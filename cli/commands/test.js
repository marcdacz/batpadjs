const { join } = require('path');

exports.command = 'test [filter]'
exports.aliases = ['t']
exports.nargs = 1
exports.desc = 'Execute batpad tests'
exports.builder = {}
exports.handler = (argv) => {
  let opts = {};
  if (argv.filter) {
    opts.filter = argv.filter;
  }
  require(join(__dirname, '../../core/testRunner')).runTests(opts);
}