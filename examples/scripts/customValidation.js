const customValidation = (fieldPath, actualValue, scenario) => {
  let expectedValue = 'This is a body from a file';
  if (actualValue === expectedValue) {
    scenario.result.state = 'passed';
  } else {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      error: "Field value is incorrect!",
      path: fieldPath,
      actual: actualValue,
      expected: expectedValue
    });
  }
};

module.exports = {
  customValidation
}