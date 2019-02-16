const { customValidation } = require('../scripts/customValidation');

module.exports = {
  name: "Module Test",
  configs: {
    baseUrl: "https://jsonplaceholder.typicode.com"
  },
  scenarios: [
    {
      test: "JS Module as a Test",
      request: {
        url: "/posts",
        method: "post",
        bodyPath: "data/bodyFromFile.json"
      },
      expected: {
        status: 201,
        data: [
          { path: "$.title", equals: "This is a title from a file" },
          { path: "$.body", callback: customValidation }
        ]
      }
    }
  ]
};



