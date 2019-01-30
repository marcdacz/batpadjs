const fs = require("fs");
const path = require("path");
const jsonpath = require("jsonpath");
const requireUncached = require("./requireUncached");
const chalk = require("chalk");
const { log } = console;

const getBodyFromPath = bodyPath => {
  if (bodyPath) {
    let bodyResolvedPath = path.resolve(bodyPath);
    if (fs.existsSync(bodyResolvedPath)) {
      return requireUncached(bodyResolvedPath);
    } else {
      log(chalk.yellow(`WARNING: Json file not found: ${bodyPath}`));
    }
  }
};

module.exports = async (scenario, configs) => {
  let bodyFromPath = getBodyFromPath(scenario.request.bodyPath) || getBodyFromPath(configs.defaultBodyPath);
  scenario.request.body = scenario.request.body || bodyFromPath || configs.defaultBody;
  if (scenario.request && scenario.request.fields) {
    for (const field of scenario.request.fields) {
      jsonpath.value(scenario.request.body, field.path, field.value);
    }
  }
  return scenario;
};
