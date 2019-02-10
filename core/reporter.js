const moment = require('moment');
const fs = require('fs');
const { join } = require('path');
const fileHelpers = require('./fileHelpers');
const timeHelpers = require('./timeHelpers');

module.exports = class Reporter {

  constructor() {
    this.test = {};
    this.test.suites = [];
    this.test.result = {
      state: "passed",
      start: moment()
    };
  }

  setTestRunResult(state) {
    this.test.result.state = state;
  }

  saveTestRunReport() {
    this.test.result.end = moment();
    this.test.result.duration = timeHelpers.getDuration(this.test.result.start, this.test.result.end);
    this.test.result.totalSuiteCount = this.test.suites.length;
    this.test.result.totalTestCount = this.getTotalTests();
    this.test.result.totalPassedTestCount = this.getTotalPassedTests();
    this.test.result.totalFailedTestCount = this.getTotalFailedTests();
    this.test.result.passPercentage = (this.test.result.totalPassedTestCount * 100 / this.test.result.totalTestCount).toFixed(2) + '%';
    this.test.result.state = this.test.result.totalFailedTestCount > 0 ? 'failed' : 'passed';

    // Write report to disk
    const settings = fileHelpers.requireUncached(join(process.cwd(), 'settings.json'));
    if (settings) {
      const reportPath = settings.paths.reports || 'reports';
      const reportFilename = join(process.cwd(), reportPath, 'testReport.json');
      fileHelpers.ensureDirectoryPath(reportFilename);
      fs.writeFileSync(reportFilename, JSON.stringify(this.test, null, 2));
    }
  }

  addTest(testSuite) {
    this.test.suites.push(testSuite);
  }

  getTotalTests() {
    let count = 0;
    this.test.suites.map(suite => {
      count += suite.scenarios.length;
    });
    return count;
  }

  getTotalFailedTests() {
    let count = 0;
    this.test.suites.map(suite => {
      count += suite.scenarios.filter(scenario => scenario.result.state === 'failed').length;
    });
    return count;
  }

  getTotalPassedTests() {
    let count = 0;
    this.test.suites.map(suite => {
      count += suite.scenarios.filter(scenario => scenario.result.state === 'passed').length;
    });
    return count;
  }

  getFailedTests() {
    let failedTests = [];
    this.test.suites.map(suite => {
      suite.scenarios.map(scenario => {
        if (scenario.result.state === 'failed') {
          failedTests.push(scenario);
        }
      })
    });    
    return failedTests;
  }
}