const jsonpath = require("jsonpath");
const { requireUncached } = require("./fileHelpers");

module.exports = async (scenario, configs) => {
  let bodyFromPath = requireUncached(scenario.request.bodyPath) || requireUncached(configs.defaultBodyPath);
  let configDefaultBody = configs.defaultBody ? JSON.parse(JSON.stringify(configs.defaultBody)) : {};
  scenario.request.body = scenario.request.body || bodyFromPath || configDefaultBody;
  if (scenario.request.fields) {
    for (const field of scenario.request.fields) {
      jsonpath.value(scenario.request.body, field.path, field.value);
    }
  }
};
