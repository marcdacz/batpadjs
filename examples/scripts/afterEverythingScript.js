module.exports = async (testProperties) => {
  let configs = testProperties.configs;
  let testSuites = testProperties.testSuites;
  let reporter = testProperties.reporter;
  
  // Rerun a test suite after
  let testSuite = testSuites[0];
  testSuite.name = 'Re-executed Test Cases';
  const batpad = require('../../core');
  const suiteProperties = {
    testSuite: testSuites[0],
    reporter: reporter
  }
  await batpad.runTestSuite(suiteProperties);
};