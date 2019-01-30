const axios = require("axios");
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { log } = console;

const DEFAULT_METHOD = "get";
let configs;

const runScript = async scriptPath => {
  if (scriptPath) {
    let scriptResolvedPath = path.resolve(scriptPath);
    if (fs.existsSync(scriptResolvedPath)) {
      await require(scriptResolvedPath)(configs);
    } else {
      log(chalk.yellow(`WARNING: Script not found: ${scriptPath}`));
    }
  }
};

module.exports.runTests = async testSuite => {
  const scenarios = testSuite.scenarios;
  log(chalk.yellow("RUNNING TEST SUITE:", testSuite.id));

  configs = testSuite.configs;

  // --- BEFORE ALL SCRIPT ---
  runScript(configs.beforeAllScript);

  // --- EXECUTE SCENARIO ---
  await Promise.map(
    scenarios,
    scenario => {
      return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(executeScenario(scenario)), configs.delay);
      });
    },
    { concurrency: configs.asyncLimit }
  );
    
  // --- AFTER ALL SCRIPT ---
  runScript(configs.afterAllScript);
};

const getMethod = scenario => {
  return scenario.request.method || configs.defaultMethod || DEFAULT_METHOD;
};

const executeScenario = async scenario => {
  log(chalk.yellow("RUNNING TEST:", scenario.label));
  
  // --- BEFORE SCRIPT ---
  runScript(scenario.beforeScript);

  // --- SEND REQUEST ---
  log("Body:", JSON.stringify(scenario.request.body));

  try {
    const res = await axios({
      method: getMethod(scenario),
      url: configs.baseUrl + configs.defaultEndpoint,
      data: scenario.request.body
    });
    log("Response status", res.status);
    log("Response body", res.data);
  } catch (error) {
    log("Response error", error);
  }
  // -- ASSERT RESPONSE ---


  // --- AFTER SCRIPT ---
  runScript(scenario.afterScript);
};
