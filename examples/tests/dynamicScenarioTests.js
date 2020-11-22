const testCombos = [
  { status: 400, statusText: 'Bad Request'},
  { status: 401, statusText: 'Unauthorized'},
  { status: 402, statusText: 'Payment Required'},
  { status: 403, statusText: 'Forbidden'},
  { status: 404, statusText: 'Not Found'},
  { status: 500, statusText: 'Internal Server Error'},
  // { status: 504, statusText: 'Gateway Timeout'}
];

const scenarioGenerator = () => {
  let scenarios = [];
  testCombos.map(combo => {
    scenarios.push({
      test: `Status: ${combo.status}`,
      request: {
        urlPath: `/${combo.status}`,
        method: "get",
        headers: {
          Accept: 'application/json'
        }
      },
      expected: {
        status: combo.status,       
        statusText: combo.statusText,       
      }
    })
  });
  return scenarios;
};

module.exports = {
  name: "Dynamic Scenario Generation Test",
  configs: {
    baseUrl: "{{statTestUrl}}"
  },
  scenarios: [ ...scenarioGenerator() ]
};



