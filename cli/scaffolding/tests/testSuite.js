const { customValidation } = require('../scripts/customValidation');

module.exports = {
  name: "Sample Test Suite",
  configs: {
    baseUrl: "{{baseUrl}}",
    beforeAllScript: "beforeAllScript.js",
    afterAllScript: "afterAllScript.js"
  },
  scenarios: [
    {
      test: "Sample Scenario",
      beforeScript: "beforeScript.js",
      afterScript: "afterScript.js",
      request: {
        urlPath: "/posts",
        method: "post",
        bodyPath: "data/bodyFromFile.json",
        fields: [
          { path: "$.title", value: "Live Long and Prosper" },
          { path: "$.body", value: "Computer, run a level-two diagnostic on warp-drive systems." },
        ]
      },
      expected: {
        status: 201,
        data: [
          { path: "$.title", equals: "Live Long and Prosper" },
          { path: "$.body", contains: "computer" },
          { path: "$.body", notcontains: "StarWars" },
          { path: "$.body", callback: customValidation, customMessage: "Beauty is transitory." }
        ]
      }
    }
  ]
};