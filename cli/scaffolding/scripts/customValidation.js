const customValidation = (fieldPath, actualValue, scenario) => {
  let expectedValue = 'Computer, run a level-two diagnostic on warp-drive systems.';
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