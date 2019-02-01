const jsonpath = require("jsonpath");
const { requireUncached } = require("./fileHelpers");

module.exports = async (scenario, configs) => {
  let bodyFromPath = requireUncached(scenario.request.bodyPath) || requireUncached(configs.defaultBodyPath);
  scenario.request.body = scenario.request.body || bodyFromPath || configs.defaultBody;
  if (scenario.request.fields) {
    for (const field of scenario.request.fields) {
      jsonpath.value(scenario.request.body, field.path, field.value);
    }
  }
};
