const jsonpath = require("jsonpath");
const { requireUncached } = require("./fileHelpers");

module.exports = async (scenario, configs) => {
  let bodyFromPath = requireUncached(scenario.request.bodyPath) || requireUncached(configs.bodyPath);
  let configbody = configs.body ? JSON.parse(JSON.stringify(configs.body)) : {};
  scenario.request.body = scenario.request.body || bodyFromPath || configbody;
  if (scenario.request.fields) {
    for (const field of scenario.request.fields) {
      jsonpath.value(scenario.request.body, field.path, field.value);
    }
  }
};
