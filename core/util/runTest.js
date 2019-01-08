const axios = require("axios");

module.exports.runTests = async testSuite => {
  const scenarios = testSuite.scenarios;
  const configs = testSuite.configs;

  // --- BEFORE SCRIPT ---
  // await require(config.beforeAllScript)();

  // --- EXECUTE SCENARIO ---
  scenarios.map(async scenario => {
    await executeScenario(scenario, configs);
  });

  // --- AFTER SCRIPT ---
  // await require(config.afterAllScript)();
};

const executeScenario = async (scenario, configs) => {
  // --- BEFORE SCRIPT ---
  // --- SEND REQUEST ---
  console.log("YEY Test!");
  // console.log(JSON.stringify(scenario));

  let res = await axios({
    method: configs.defaultMethod,
    url: configs.baseUrl + configs.defaultEndpoint,
    data: {
      id: 12345,
      title: "Flintstone",
      body: "Blah blah blah"
    }
  }); //.then(res => console.log(res.data));
  console.log(res.data);

  // -- ASSERT RESPONSE ---
  // --- AFTER SCRIPT ---
};
