const jsonpath = require("jsonpath");
const log = require("./logger");
let isFailed;

module.exports = async (scenario, actualResponse, configs) => {  
  scenario.result.state = 'passed';  
  isFailed = false;
  
  if (scenario.expected && actualResponse) {
    let expectedResponse = scenario.expected;   

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

    if (expectedResponse.statusText) {
      if (actualResponse.statusText != expectedResponse.statusText) {
        isFailed = true;
        scenario.result.context.push({
          error: "Response status text is incorrect!",
          actual: actualResponse.statusText,
          expected: expectedResponse.statusText
        });
      }
    }

    if (expectedResponse.data) {
      for (const dataField of expectedResponse.data) {
        if (actualResponse.data) {          
          let actualValue = jsonpath.value(actualResponse.data, dataField.path);
          let expectedValue = dataField.value;
          if (actualValue != expectedValue) {
            isFailed = true;
            scenario.result.context.push({
              error: "Field value is incorrect!",
              path: dataField.path,
              actual: actualValue,
              expected: expectedValue
            });
          }
        } else {
          isFailed = true;
          scenario.result.context.push({
            error: "Field not found!"
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

  
  return isFailed;
};
