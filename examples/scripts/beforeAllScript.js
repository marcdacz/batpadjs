module.exports = async (testProperties) => {  
  let configs = testProperties.configs;
  configs.body.title = "Using Default Body Title from Configs updated in BeforeAll script";
  configs.body.body = "Using Default Body Data from Configs updated in BeforeAll script";
};