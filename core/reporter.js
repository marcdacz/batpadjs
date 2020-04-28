const moment = require("moment");
const fs = require("fs");
const { join } = require("path");
const builder = require("junit-report-builder");
const xunitViewer = require("xunit-viewer");
const fileHelpers = require("./fileHelpers");
const timeHelpers = require("./timeHelpers");
const log = require("./logger");

module.exports = class Reporter {
    constructor(settings) {
        this.settings = settings;
        this.test = {};
        this.test.suites = [];
        this.test.result = {
            state: "passed",
            start: moment(),
        };
    }

    setTestRunResult(state) {
        this.test.result.state = state;
    }

    displayOverallTestResult() {
        if (this.test.result.totalTestCount > 0) {
            log.lines();
            log.info("------------------------------------------------------------------------------");
            log.keyValue(`Start:`, `\t\t\t${this.test.result.start}`);
            log.keyValue(`End:`, `\t\t\t${this.test.result.end}`);
            log.keyValue(`Duration:`, `\t\t${this.test.result.duration}`);
            log.keyValue(`Total:`, `\t\t\t${this.test.result.totalTestCount}`);
            log.keyValue(`Passed:`, `\t\t${this.test.result.totalPassedTestCount}`);
            log.keyValue(`Failed:`, `\t\t${this.test.result.totalFailedTestCount}`);
            log.keyValue(`Pass Percentage:`, `\t${this.test.result.passPercentage}`);
            log.info("------------------------------------------------------------------------------");

            log.lines();
            if (this.test.result.state === "passed") {
                log.info("TEST RUN SUCCESSULLY FINISHED! \uD83D\uDE0E");
            } else if (this.test.result.state === "failed") {
                log.error("TEST RUN FAILED! \uD83D\uDE22");
                let count = 1;
                let failedTests = this.getFailedTests();
                failedTests.map((scenario) => {
                    log.error(`\n${count}. ${scenario.test}`);
                    log.warn(`Test Context:`);
                    log.failedTestContext(scenario.result.context);
                    count++;
                });
            }
            log.lines();
        }
    }

    async saveTestRunReport() {
        this.test.result.end = moment();
        this.test.result.duration = timeHelpers.getDuration(this.test.result.start, this.test.result.end);
        this.test.result.totalPassedTestCount = this.getTotalPassedTests();
        this.test.result.totalFailedTestCount = this.getTotalFailedTests();
        this.test.result.totalTestCount = this.test.result.totalPassedTestCount + this.test.result.totalFailedTestCount;
        this.test.result.totalSuiteCount = this.test.suites.length;
        this.test.result.passPercentage =
            ((this.test.result.totalPassedTestCount * 100) / this.test.result.totalTestCount).toFixed(2) + "%";
        this.test.result.state = this.test.result.totalFailedTestCount > 0 ? "failed" : "passed";

        let settingsPath = this.settings.paths || {};
        const reportPath = settingsPath.reports || "reports";
        const reportFilename = join(process.cwd(), reportPath, "testReport.json");
        fileHelpers.ensureDirectoryPath(reportFilename);

        let junitReportXml = join(process.cwd(), reportPath, "report.xml");
        let junitReportHtml = join(process.cwd(), reportPath, "report.html");

        this.displayOverallTestResult();

        builder.writeTo(junitReportXml);
        await xunitViewer({
            results: junitReportXml,
            output: junitReportHtml,
            title: "BatPadJS Report",
        });
    }

    addTest(testSuite) {
        this.test.suites.push(testSuite);

        let suite = builder.testSuite().name(testSuite.name);
        if (testSuite.configs) {
            let configs = testSuite.configs;
            if (configs.baseUrl) suite.property("baseUrl", configs.baseUrl);
            if (configs.url) suite.property("url", configs.url);
            if (configs.method) suite.property("method", configs.method);
            if (configs.header) suite.property("header", configs.header);
            if (configs.proxy) suite.property("proxy", configs.proxy);
            if (configs.body) suite.property("body", JSON.stringify(configs.body, null, 2));
            if (configs.bodyPath) suite.property("bodyPath", configs.bodyPath);
            if (configs.beforeAllScript) suite.property("beforeAllScript", configs.beforeAllScript);
            if (configs.beforeEachScript) suite.property("beforeEachScript", configs.beforeEachScript);
            if (configs.afterEachScript) suite.property("afterEachScript", configs.afterEachScript);
            if (configs.afterAllScript) suite.property("afterAllScript", configs.afterAllScript);
        }

        testSuite.scenarios.map((scenario) => {
            let testCase = suite
                .testCase()
                .className("scenario.test")
                .name(scenario.test)
                .time(scenario.result.duration);
            let testCaseData = {
                requestBody: scenario.request.body || undefined,
                expected: scenario.expected || undefined,
                responseData: scenario.result.actualResponse || undefined,
                responseStatus: scenario.result.actualResponseStatus || undefined,
                resultContext: scenario.result.context || undefined,
            };
            testCase.standardOutput(JSON.stringify(testCaseData, null, 2));
            if (scenario.result.state === "failed") {
                testCase.failure(JSON.stringify(testCaseData, null, 2));
            }
        });
    }

    getTotalFailedTests() {
        let count = 0;
        this.test.suites.map((suite) => {
            count += suite.scenarios.filter((scenario) => {
                if (scenario.result) {
                    return scenario.result.state === "failed";
                }
            }).length;
        });
        return count;
    }

    getTotalPassedTests() {
        let count = 0;
        this.test.suites.map((suite) => {
            count += suite.scenarios.filter((scenario) => {
                if (scenario.result) {
                    return scenario.result.state === "passed";
                }
            }).length;
        });
        return count;
    }

    getFailedTests() {
        let failedTests = [];
        this.test.suites.map((suite) => {
            suite.scenarios.map((scenario) => {
                if (scenario.result && scenario.result.state === "failed") {
                    failedTests.push(scenario);
                }
            });
        });
        return failedTests;
    }
};
