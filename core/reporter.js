const moment = require('moment');
const fs = require('fs');
const { join } = require('path');
const builder = require('junit-report-builder');
const xunitViewer = require('xunit-viewer/cli');
const fileHelpers = require('./fileHelpers');
const timeHelpers = require('./timeHelpers');

module.exports = class Reporter {

  constructor(settings) {
    this.settings = settings;
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
    this.test.result.totalPassedTestCount = this.getTotalPassedTests();
    this.test.result.totalFailedTestCount = this.getTotalFailedTests();
    this.test.result.totalTestCount = this.test.result.totalPassedTestCount + this.test.result.totalFailedTestCount;
    this.test.result.totalSuiteCount = this.test.suites.length;
    this.test.result.passPercentage = (this.test.result.totalPassedTestCount * 100 / this.test.result.totalTestCount).toFixed(2) + '%';
    this.test.result.state = this.test.result.totalFailedTestCount > 0 ? 'failed' : 'passed';

    let settingsPath = this.settings.paths || {};
    const reportPath = settingsPath.reports || 'reports';
    const reportFilename = join(process.cwd(), reportPath, 'testReport.json');
    fileHelpers.ensureDirectoryPath(reportFilename);
    fs.writeFileSync(reportFilename, JSON.stringify(this.test, null, 2));

    let junitReportXml = join(process.cwd(), reportPath, 'junitReport.xml');
    let junitReportHtml = join(process.cwd(), reportPath, 'junitReport.html');
    builder.writeTo(junitReportXml);
    xunitViewer({
      results: junitReportXml,
      output: junitReportHtml,
      title: 'BatPadJS Report'
    })
  }

  addTest(testSuite) {
    this.test.suites.push(testSuite);

    let suite = builder.testSuite().name(testSuite.name)
    if (testSuite.configs){
      suite.property('configs', JSON.stringify(testSuite.configs, null, 2));
    }     

    testSuite.scenarios.map(scenario => {
      let testCase = suite.testCase().className('scenario.test').name(scenario.test).time(scenario.result.duration);
      testCase.standardOutput(JSON.stringify(scenario, null, 2));

      if (scenario.result.state === "failed") {
        testCase.failure(JSON.stringify(scenario.result.context, null, 2));
      }
    })
  }

  getTotalFailedTests() {
    let count = 0;
    this.test.suites.map(suite => {
      count += suite.scenarios.filter(scenario => {
        if (scenario.result) {
          return scenario.result.state === 'failed'
        }
      }).length;
    });
    return count;
  }

  getTotalPassedTests() {
    let count = 0;
    this.test.suites.map(suite => {
      count += suite.scenarios.filter(scenario => {
        if (scenario.result) {
          return scenario.result.state === 'passed'
        }
      }).length;
    });
    return count;
  }

  getFailedTests() {
    let failedTests = [];
    this.test.suites.map(suite => {
      suite.scenarios.map(scenario => {
        if (scenario.result && scenario.result.state === 'failed') {
          failedTests.push(scenario);
        }
      })
    });
    return failedTests;
  }
}