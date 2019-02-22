module.exports = async (testProperties) => {
  let scenario = testProperties.scenario;
  let actualResponse = testProperties.actualResponse;
  
  console.log('This is a script running after the test:', scenario.test);
};