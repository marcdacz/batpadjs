const jsonpath = require("jsonpath");
const getJsonFromFile = require("./getJsonFromFile");

module.exports = async (scenario, configs) => {
  let bodyFromPath = getJsonFromFile(scenario.request.bodyPath) || getJsonFromFile(configs.defaultBodyPath);
  scenario.request.body = scenario.request.body || bodyFromPath || configs.defaultBody;
  if (scenario.request.fields) {
    for (const field of scenario.request.fields) {
      jsonpath.value(scenario.request.body, field.path, field.value);
    }
  }
};
