const axios = require("axios");
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const log = require("./logger");
const fileHelpers = require("./fileHelpers")

const DEFAULT_METHOD = "get";
const DEFAULT_SETTINGS_FILE = "settings.json";
const DEFAULT_TESTS_PATH = "tests";

module.exports.runTests = async (settingsFilePath, filter) => {
  let testFilter = filter || "";
  let settingsFile = settingsFilePath || DEFAULT_SETTINGS_FILE;
  let settings = fileHelpers.requireUncached(settingsFile);
  let testSuitesPath = settings.paths.tests || DEFAULT_TESTS_PATH;
  let testSuites = fileHelpers.getJsFiles(testSuitesPath);
  let defaultGlobalDelay = settings.delay || 0;
  let defaultGlobalAsyncLimit = settings.asyncLimit || 1;

  await Promise.map(
    testSuites,
    testSuite => {
      let suite = fileHelpers.requireUncached(testSuite);
      if (suite.configs && suite.scenarios) {
        return new Promise(function(resolve, reject) {
          setTimeout(() =>
            resolve(executeSuite(suite, testFilter)), defaultGlobalDelay);
        });
      }
    },
    { concurrency: defaultGlobalAsyncLimit }
  );
};

const runScript = async (scriptPath, testObject) => {
  if (scriptPath) {
    let scriptResolvedPath = path.resolve(scriptPath);
    if (fs.existsSync(scriptResolvedPath)) {
      try {
        await require(scriptResolvedPath)(testObject);
      } catch (error) {
        log.error(`ERROR: ${error}`);
      }
    } else {
      log.warn(`WARNING: Script not found: ${scriptPath}`);
    }
  }
};

const executeSuite = async (testSuite, testFilter) => {
  const configs = testSuite.configs;
  const scenarios = testSuite.scenarios.filter(scenario => scenario.test.match(testFilter));

  let defaultDelay = configs.delay || 0;
  let defaultAsyncLimit = configs.asyncLimit || 1;

  if (scenarios.length > 0) {
    log.info(testSuite.name);

    // --- BEFORE ALL SCRIPT ---
    runScript(configs.beforeAllScript, configs);

    // --- EXECUTE SCENARIO ---
    await Promise.map(
      scenarios,
      scenario => {
        return new Promise(function(resolve, reject) {
          setTimeout(() => resolve(executeScenario(scenario, configs)), defaultDelay);
        });
      },
      { concurrency: defaultAsyncLimit }
    );

    // --- AFTER ALL SCRIPT ---
    runScript(configs.afterAllScript, configs);
  }
}

const executeScenario = async (scenario, configs) => {
  scenario.request = scenario.request ? scenario.request : {};
  scenario.request.fields = scenario.request.fields ? scenario.request.fields : [];
  scenario.result = {};
  scenario.result.context = [];

  // --- BEFORE SCRIPT ---
  runScript(configs.beforeEachScript, scenario);
  runScript(scenario.beforeScript, scenario);

  // --- REQUEST SCRIPT ---
  require('./requestScript')(scenario, configs);

  // --- SEND REQUEST ---
  try {
    let url = scenario.request.url ? configs.baseUrl + scenario.request.url : configs.baseUrl + configs.defaultEndpoint
    const res = await axios({
      url: url,
      method: scenario.request.method || configs.defaultMethod || DEFAULT_METHOD,
      headers: scenario.headers,
      data: scenario.request.body,
      timeout: configs.timeout,
      withCredentials: scenario.withCredentials,
      auth: scenario.auth,
      xsrfCookieName: scenario.xsrfCookieName,
      xsrfHeaderName: scenario.xsrfHeaderName,
      proxy: scenario.proxy
    });
    scenario.actualResponse = res;
  } catch (error) {
    log.error("Response error: " + error);
  }

  // --- RESPONSE SCRIPT ---
  require('./responseScript')(scenario, configs);

  // --- AFTER SCRIPT ---
  runScript(scenario.afterScript, scenario);
  runScript(configs.afterEachScript, scenario);
};
