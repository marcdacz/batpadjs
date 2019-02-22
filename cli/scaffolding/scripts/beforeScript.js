module.exports = async (testProperties) => {
  let scenario = testProperties.scenario;
  
  console.log('This is a script running before the test:', scenario.test);
};