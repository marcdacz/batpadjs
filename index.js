const { join } = require('path');
const testRunner = require(join(__dirname, './core/testRunner'));

module.exports.runTests = (opts) => {
  testRunner.runTests(opts);
};

module.exports.runTestSuite = async (opts) => {
  await testRunner.runTestSuite(opts);
};

module.exports.JsonBuilder =  require(join(__dirname, './core/jsonBuilder'));
