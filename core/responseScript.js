const jsonpath = require("jsonpath");

module.exports = async (scenario, actualResponse, configs) => {
  if (!scenario.expected) {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      error: `No expected results!`
    });
    return;
  }

  if (!actualResponse) {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      error: `Response is undefined!`
    });
    return;
  }

  if (scenario.expected && actualResponse) {
    let expectedResponse = scenario.expected;

    if (expectedResponse.status) {
      if (actualResponse.status != expectedResponse.status) {
        scenario.result.state = 'failed';
        scenario.result.context.push({
          error: "Response status is incorrect!",
          actual: actualResponse.status,
          expected: expectedResponse.status
        });
      }
    }

    if (expectedResponse.statusText) {
      if (actualResponse.statusText != expectedResponse.statusText) {
        scenario.result.state = 'failed';
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
          
          // Equals
          if (dataField.equals) {
            let expectedValue = dataField.equals;
            if (actualValue !== expectedValue) {
              scenario.result.state = 'failed';
              scenario.result.context.push({
                error: "Field value is incorrect!",
                path: dataField.path,
                actual: actualValue,
                expected: expectedValue
              });
            }
          }

          // Contains
          if (dataField.contains) {
            let regex = RegExp(dataField.contains, 'i');
            if (!regex.test(actualValue)) {
              scenario.result.state = 'failed';
              scenario.result.context.push({
                error: "Field value is incorrect!",
                path: dataField.path,
                actual: actualValue,
                contains: dataField.contains
              });
            }
          }

          // NotContains
          if (dataField.notcontains) {
            let regex = RegExp(dataField.notcontains, 'i');
            if (regex.test(actualValue)) {
              scenario.result.state = 'failed';
              scenario.result.context.push({
                error: "Field value is incorrect!",
                path: dataField.path,
                actual: actualValue,
                notcontains: dataField.notcontains
              });
            }
          }

          // Callback
          if (dataField.callback) {
            dataField.callback(dataField.path, actualValue, scenario);
          }
        } else {
          scenario.result.state = 'failed';
          scenario.result.context.push({
            error: "Field not found!"
          });
        }
      }
    }

  }

  return;
};
