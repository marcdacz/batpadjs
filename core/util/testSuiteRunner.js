const axios = require("axios");
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const log = require("./logger");
const fileHelpers = require("./fileHelpers")

const DEFAULT_METHOD = "get";
const DEFAULT_SETTINGS_FILE = "settings.json";
const DEFAULT_TESTS_PATH = "tests";

module.exports.runTests = async (settingsFilePath) => {
  let settingsFile = settingsFilePath || DEFAULT_SETTINGS_FILE;
  let settings = fileHelpers.requireUncached(settingsFile);
  let testSuitesPath = settings.paths.tests || DEFAULT_TESTS_PATH;
  let testSuites = fileHelpers.getJsFiles(testSuitesPath);
  let defaultGlobalDelay = settings.delay || 0;  
  let defaultGlobalAsyncLimit = settings.asyncLimit || 1;  

  await Promise.map(
    testSuites,
    testSuite => {
      let suite = fileHelpers.requireUncached(testSuite.path);
      if (suite.configs && suite.scenarios) {
        return new Promise(function(resolve, reject) {
          setTimeout(() =>
            resolve(executeSuite(suite)), defaultGlobalDelay);
        });
      }
    },
    { concurrency: defaultGlobalAsyncLimit }
  );
};

const runScript = async (scriptPath, configs) => {
  if (scriptPath) {
    let scriptResolvedPath = path.resolve(scriptPath);
    if (fs.existsSync(scriptResolvedPath)) {
      await require(scriptResolvedPath)(configs);
    } else {
      log.warn(`WARNING: Script not found: ${scriptPath}`);
    }
  }
};

const executeSuite = async testSuite => {
  const configs = testSuite.configs;
  const scenarios = testSuite.scenarios;
  let defaultDelay = configs.delay || 0;

  log.success(testSuite.name);

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
    { concurrency: configs.asyncLimit }
  );

  // --- AFTER ALL SCRIPT ---
  runScript(configs.afterAllScript, configs);
}

const executeScenario = async (scenario, configs) => {
  scenario.request = scenario.request ? scenario.request : {};
  scenario.result = {};
  scenario.result.context = [];

  // --- BEFORE SCRIPT ---
  runScript(configs.beforeEachScript);
  runScript(scenario.beforeScript);

  // --- REQUEST SCRIPT ---
  require('./requestScript')(scenario, configs);

  // --- SEND REQUEST ---
  try {
    const res = await axios({
      method: scenario.request.method || configs.defaultMethod || DEFAULT_METHOD,
      url: configs.baseUrl + configs.defaultEndpoint,
      data: scenario.request.body
    });
    scenario.actualResponse = res;
  } catch (error) {
    log.error("Response error: " + error);
  }

  // --- RESPONSE SCRIPT ---
  require('./responseScript')(scenario, configs);

  // --- AFTER SCRIPT ---
  runScript(scenario.afterScript);
  runScript(configs.afterEachScript);
};
