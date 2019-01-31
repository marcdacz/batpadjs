const axios = require("axios");
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const log = require("./logger");

const DEFAULT_METHOD = "get";

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

module.exports.runTests = async testSuite => {
  const configs = testSuite.configs;
  const scenarios = testSuite.scenarios;
  
  log.success(testSuite.name);  

  // --- BEFORE ALL SCRIPT ---
  runScript(configs.beforeAllScript, configs);

  // --- EXECUTE SCENARIO ---
  await Promise.map(
    scenarios,
    scenario => {
      return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(executeScenario(scenario, configs)), configs.delay);
      });
    },
    { concurrency: configs.asyncLimit }
  );
    
  // --- AFTER ALL SCRIPT ---
  runScript(configs.afterAllScript, configs);
};

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
