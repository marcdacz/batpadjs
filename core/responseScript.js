const jsonpath = require("jsonpath");

module.exports = async (scenario, actualResponse, configs) => {

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
      } else {
        scenario.result.state = 'passed';
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
      } else {
        scenario.result.state = 'passed';
      }
    }

    if (expectedResponse.data) {
      for (const dataField of expectedResponse.data) {
        if (actualResponse.data) {
          let actualValue = jsonpath.value(actualResponse.data, dataField.path);

          // Equals
          if (dataField.equals) {
            let expectedValue = dataField.equals;
            if (actualValue != expectedValue) {
              scenario.result.state = 'failed';
              scenario.result.context.push({
                error: "Field value is incorrect!",
                path: dataField.path,
                actual: actualValue,
                expected: expectedValue
              });
            } else {
              scenario.result.state = 'passed';
            }
          }

          // Contains
          if (dataField.contains) {
            let regex = RegExp(dataField.contains);
            if (regex.test(actualValue)) {
              scenario.result.state = 'passed';              
            } else {
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
            let regex = RegExp(dataField.notcontains);
            if (!regex.test(actualValue)) {
              scenario.result.state = 'passed';              
            } else {
              scenario.result.state = 'failed';
              scenario.result.context.push({
                error: "Field value is incorrect!",
                path: dataField.path,
                actual: actualValue,
                notcontains: dataField.notcontains
              });
            }
          }
        } else {
          scenario.result.state = 'failed';
          scenario.result.context.push({
            error: "Field not found!"
          });
        }
      }
    }

  } else {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      error: `Response is undefined!`
    });
  }
};
