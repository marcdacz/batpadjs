const customValidation = (field, actualValue, scenario) => {
  let expectedValue = 'This is a body from a file';
  if (actualValue != expectedValue) {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      message: field.customMessage,
      path: field.path,
      actual: actualValue,
      expected: expectedValue
    });
  }
};

module.exports = {
  customValidation
}