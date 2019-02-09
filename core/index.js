const { join } = require('path');

module.exports.test = (opts) => {
  require(join(__dirname, './testRunner')).runTests(opts)
}