const customValidation = (field, actualValue, scenario) => {
  let expectedValue = 'Computer, run a level-two diagnostic on warp-drive systems.';
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