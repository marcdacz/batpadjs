module.exports = async (configs) => {
  configs.defaultBody.title = "Using Default Body Title from Configs updated in BeforeAll script";
  configs.defaultBody.body = "Using Default Body Data from Configs updated in BeforeAll script";
};