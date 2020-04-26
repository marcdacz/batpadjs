const axios = require("axios");
const http = require("http");
const https = require("https");
const Promise = require("bluebird");
const throat = require("throat")(require("bluebird"));
const fs = require("fs");
const { join, resolve } = require("path");
const moment = require("moment");
const log = require("./logger");
const fileHelpers = require("./fileHelpers");
const timeHelpers = require("./timeHelpers");
const Reporter = require("./reporter");

const DEFAULT_METHOD = "get";
const DEFAULT_SETTINGS_FILE = "settings";
const DEFAULT_SCRIPTS_PATH = "scripts";
const DEFAULT_TESTS_PATH = "tests";
const DEFAULT_TESTS_FILTER = "^((?!@ignore).)*$";
const DEFAULT_DELAY = 0;
const DEFAULT_ASYNC_LIMIT = 1;

const runScript = async (script, testObject) => {
    if (script) {
        let settings = testObject.settings;
        let settingsPath = settings.paths || {};
        let scriptsPath = settingsPath.scripts || DEFAULT_SCRIPTS_PATH;
        let scriptResolvedPath = resolve(join(scriptsPath, script));
        if (fs.existsSync(scriptResolvedPath)) {
            try {
                await require(scriptResolvedPath)(testObject);
            } catch (error) {
                log.error(`ERROR: ${error}`);
            }
        } else {
            log.warn(`WARNING: Script not found: ${script}`);
        }
    }
};

const runTests = async (opts) => {
    opts = opts ? opts : {};
    let testFilter = opts.filter || DEFAULT_TESTS_FILTER;

    let settingsFilename = fileHelpers.getJsOrJsonFileName(DEFAULT_SETTINGS_FILE);
    if (settingsFilename.startsWith(`WARNING`)) {
        log.warn(`WARNING: Settings file not found!`);
        return;
    }

    let settings = fileHelpers.requireUncached(settingsFilename);
    let settingsPath = settings.paths || {};
    let settingsConfigs = settings.configs || {};

    let testSuitesPath = settingsPath.tests || DEFAULT_TESTS_PATH;
    let testSuites =
        opts.testSuites ||
        fileHelpers.getJsFiles(testSuitesPath).map((testSuite) => fileHelpers.requireUncached(testSuite));

    if (testSuites && testSuites.length > 0) {
        let reporter = new Reporter(settings);
        if (opts.reporter) {
            reporter = opts.reporter;
        }

        // --- BEFORE ALL SCRIPT ---
        await runScript(settingsConfigs.beforeAllScript, {
            settings: settings,
            testSuites: testSuites,
            reporter: reporter,
        });

        // --- EXECUTE SUITE ---
        await Promise.all(
            testSuites.map(
                throat(DEFAULT_ASYNC_LIMIT, (testSuite) => {
                    if (testSuite.name && testSuite.scenarios) {
                        return new Promise(function (resolve, reject) {
                            setTimeout(
                                () =>
                                    resolve(
                                        runTestSuite({
                                            testSuite: testSuite,
                                            testFilter: testFilter,
                                            reporter: reporter,
                                            settings: settings,
                                        })
                                    ),
                                DEFAULT_DELAY
                            );
                        });
                    }
                })
            )
        );

        // --- AFTER ALL SCRIPT ---
        await runScript(settingsConfigs.afterAllScript, {
            settings: settings,
            testSuites: testSuites,
            reporter: reporter,
        });

        // --- SAVE TEST REPORT ---
        reporter.saveTestRunReport();
        displayOverallTestResult(reporter);

        if (reporter.test && reporter.test.result.state === "failed") {
            process.exitCode = 1;
        }
    }
};

const displayOverallTestResult = (reporter) => {
    if (reporter.test.result.totalTestCount > 0) {
        log.lines();
        log.info("------------------------------------------------------------------------------");
        log.keyValue(`Start:`, `\t\t\t${reporter.test.result.start}`);
        log.keyValue(`End:`, `\t\t\t${reporter.test.result.end}`);
        log.keyValue(`Duration:`, `\t\t${reporter.test.result.duration}`);
        log.keyValue(`Total:`, `\t\t\t${reporter.test.result.totalTestCount}`);
        log.keyValue(`Passed:`, `\t\t${reporter.test.result.totalPassedTestCount}`);
        log.keyValue(`Failed:`, `\t\t${reporter.test.result.totalFailedTestCount}`);
        log.keyValue(`Pass Percentage:`, `\t${reporter.test.result.passPercentage}`);
        log.info("------------------------------------------------------------------------------");

        log.lines();
        if (reporter.test.result.state === "passed") {
            log.info("TEST RUN SUCCESSULLY FINISHED! \uD83D\uDE0E");
        } else if (reporter.test.result.state === "failed") {
            log.error("TEST RUN FAILED! \uD83D\uDE22");
            let count = 1;
            let failedTests = reporter.getFailedTests();
            failedTests.map((scenario) => {
                log.error(`\n${count}. ${scenario.test}`);
                log.warn(`Test Context:`);
                log.failedTestContext(scenario.result.context);
                count++;
            });
        }
        log.lines();
    }
};

const runTestSuite = async (suiteProperties) => {
    let testSuite = suiteProperties.testSuite;
    let testFilter = suiteProperties.testFilter;
    let reporter = suiteProperties.reporter;
    let settings = suiteProperties.settings || {};
    let settingsConfigs = settings.configs || {};
    let configs = testSuite.configs || {};

    const scenarios = testSuite.scenarios.filter((scenario) => {
        if (scenario.test) {
            return scenario.test.match(new RegExp(testFilter, "i"));
        }
    });

    let defaultDelay = configs.delay || settingsConfigs.delay || DEFAULT_DELAY;
    let defaultAsyncLimit = configs.asyncLimit || settingsConfigs.asyncLimit || DEFAULT_ASYNC_LIMIT;

    if (scenarios.length > 0) {
        log.lines();
        log.info(testSuite.name);

        // --- BEFORE ALL SCRIPT ---
        await runScript(configs.beforeAllScript, {
            configs: configs,
            testSuite: testSuite,
            reporter: reporter,
            settings: settings,
        });

        // --- EXECUTE SCENARIO ---
        await Promise.all(
            scenarios.map(
                throat(
                    defaultAsyncLimit,
                    (scenario) =>
                        new Promise((resolve, reject) => {
                            setTimeout(
                                () =>
                                    resolve(
                                        runScenario({
                                            scenario: scenario,
                                            configs: configs,
                                            reporter: reporter,
                                            settings: settings,
                                        })
                                    ),
                                defaultDelay
                            );
                        })
                )
            )
        );

        // --- AFTER ALL SCRIPT ---
        await runScript(configs.afterAllScript, {
            configs: configs,
            testSuite: testSuite,
            reporter: reporter,
            settings: settings,
        });

        // --- TEST REPORT ---
        reporter.addTest(testSuite);
    }
};

const getEnvar = (varName, settings) => {
    let settingsConfigs = settings.configs || {};
    const regex = new RegExp("(?<={{)(.*)(?=}})");
    let envarValue = varName;
    if (regex.test(envarValue)) {
        let envarMatch = envarValue.match(regex);
        if (envarMatch && envarMatch.length > 0) {
            let currentEnvironment = settingsConfigs.env || process.env.NODE_ENV;
            envarValue = settings.environments[currentEnvironment][envarMatch[0].trim()];
        }
    }
    return envarValue;
};

const runScenario = async (scenarioProperties) => {
    let scenario = scenarioProperties.scenario;
    let configs = scenarioProperties.configs;
    let reporter = scenarioProperties.reporter;
    let settings = scenarioProperties.settings;
    let settingsConfigs = settings.configs || {};

    scenario.request = scenario.request ? scenario.request : {};
    scenario.request.fields = scenario.request.fields ? scenario.request.fields : [];
    scenario.result = {};
    scenario.result.context = [];
    scenario.result.state = "passed";
    scenario.result.start = moment();

    // --- BEFORE SCRIPT ---
    await runScript(configs.beforeEachScript, { scenario: scenario, settings: settings });
    await runScript(scenario.beforeScript, { scenario: scenario, settings: settings });

    // --- REQUEST SCRIPT ---
    require("./requestScript")(scenario, configs);

    // --- SEND REQUEST ---
    let actualResponse;
    try {
        let defaultUrl = configs.baseUrl || settingsConfigs.baseUrl;
        let baseUrl = getEnvar(defaultUrl, settings);
        let urlPath = scenario.request.urlPath || configs.urlPath;
        let url = scenario.request.url || baseUrl + urlPath;
        let method = scenario.request.method || configs.method || settingsConfigs.method || DEFAULT_METHOD;
        let headers = scenario.request.headers || configs.headers || settingsConfigs.headers;
        let proxy = scenario.request.proxy || configs.proxy || settingsConfigs.proxy || false;
        let httpAgent = scenario.request.httpAgent || configs.httpAgent || settingsConfigs.httpAgent;
        let httpsAgent = scenario.request.httpsAgent || configs.httpsAgent || settingsConfigs.httpsAgent;

        const res = await axios({
            url: url,
            method: method,
            headers: headers,
            params: scenario.request.params,
            data: scenario.request.body,
            timeout: configs.timeout,
            withCredentials: scenario.request.withCredentials,
            auth: scenario.request.auth,
            xsrfCookieName: scenario.request.xsrfCookieName,
            xsrfHeaderName: scenario.request.xsrfHeaderName,
            proxy: proxy,
            httpAgent: httpAgent ? new http.Agent(httpAgent) : undefined,
            httpsAgent: httpsAgent ? new https.Agent(httpsAgent) : undefined,
        });
        actualResponse = res;
    } catch (error) {
        scenario.result.error = error;
        if (error.response) {
            actualResponse = error.response;
        }
    }

    // --- RESPONSE SCRIPT ---
    await require("./responseScript")(scenario, actualResponse, configs);

    // --- AFTER SCRIPT ---
    await runScript(scenario.afterScript, { scenario: scenario, actualResponse: actualResponse, settings: settings });
    await runScript(configs.afterEachScript, {
        scenario: scenario,
        actualResponse: actualResponse,
        settings: settings,
    });

    scenario.result.end = moment();
    scenario.result.duration = timeHelpers.getDuration(scenario.result.start, scenario.result.end);

    if (actualResponse) {
        scenario.result.actualResponse = actualResponse.data;
        scenario.result.actualResponseStatus = actualResponse.status;
    }

    if (scenario.result.state === "failed") {
        reporter.setTestRunResult("failed");
        log.failedTest(scenario.test, scenario.result.duration);
        if (settingsConfigs.debug === true && scenario.result.error) {
            log.error(scenario.result.error);
        }
        log.failedTestContext(scenario.result.context);
    } else {
        log.passedTest(scenario.test, scenario.result.duration);
    }
};

module.exports = {
    runTests,
    runTestSuite,
};
