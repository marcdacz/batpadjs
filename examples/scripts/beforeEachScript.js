module.exports = async (testProperties) => {
  let scenario = testProperties.scenario;
  scenario.request.fields.push({
    path: "$.title",
    value: "Using Default Body from Configs updated in BeforeEach script"
  });
};