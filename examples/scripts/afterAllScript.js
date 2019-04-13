module.exports = async (testProperties) => {
  let configs = testProperties.configs;
  let testSuite = testProperties.testSuite;
  let reporter = testProperties.reporter;
  let settings = testProperties.settings;
  
  // Rerun a test suite after
  testSuite.name = 'Re-run Test Suite';
  testSuite.configs.afterAllScript = undefined; // to avoid infinite loop in itself
  const batpad = require('../../core');
  const suiteProperties = {
    testSuite: testSuite,
    reporter: reporter,
    settings: settings
  }
  await batpad.runTestSuite(suiteProperties);
};