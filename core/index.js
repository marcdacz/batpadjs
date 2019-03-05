const { join } = require('path');

module.exports.test = (opts) => {
  require(join(__dirname, './testRunner')).runTests(opts);
};

module.exports.JsonBuilder =  require(join(__dirname, './jsonBuilder'));
