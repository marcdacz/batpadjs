const JsonBuilder = require('./jsonBuilder');
const { requireUncached } = require('./fileHelpers');

module.exports = async (scenario, configs) => {
  let bodyFromPath = requireUncached(scenario.request.bodyPath) || requireUncached(configs.bodyPath);
  let configbody = configs.body ? JSON.parse(JSON.stringify(configs.body)) : {};
  scenario.request.body = scenario.request.body || bodyFromPath || configbody;
  if (scenario.request.fields) {
    let jb = new JsonBuilder(scenario.request.body);
    for (const field of scenario.request.fields) {
      jb.set(field.path, field.value);
    }    
  }
};
