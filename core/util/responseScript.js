const jsonpath = require("jsonpath");
const log = require("./logger");
let isFailed;

module.exports = async (scenario, configs) => {  
  scenario.result.state = 'passed';  
  isFailed = false;

  if (scenario.response && scenario.actualResponse) {
    let expectedResponse = scenario.response;
    let actualResponse = scenario.actualResponse;

    if (expectedResponse.status) {
      if (actualResponse.status != expectedResponse.status) {
        isFailed = true;
        scenario.result.context.push({
          error: "Response status is incorrect!",
          actual: actualResponse.status,
          expected: expectedResponse.status
        });
      }
    }

    if (expectedResponse.fields) {
      for (const field of expectedResponse.fields) {
        let actualValue = jsonpath.value(actualResponse.data, field.path);
        let expectedValue = field.value;
        if (actualValue != expectedValue) {
          isFailed = true;
          scenario.result.context.push({
            error: "Field value is incorrect!",
            actual: actualValue,
            expected: expectedValue
          });
        }
      }
    }
  } else {
    isFailed = true;
    scenario.result.context.push({
      error: `Response is undefined!`
    });
  }

  if (isFailed) {
    scenario.result.state = 'failed';    
    scenario.result.context.map(context => {
      log.error(` ${JSON.stringify(context)}`);
    })
    log.error(` \u2715 ${scenario.test}`);
  } else {
    log.success(` \u2713 ${scenario.test}`);
  }
};
