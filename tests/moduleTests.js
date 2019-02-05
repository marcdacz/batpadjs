module.exports = {
  name: "Module Test",
  configs: {
    baseUrl: "https://jsonplaceholder.typicode.com"
  },
  scenarios: [
    {
      test: "Validate JS Module as a Test",
      request: {
        url: "/posts",
        method: "post",
        bodyPath: "data/bodyFromFile.json"
      },
      expected: {
        status: 201,
        data: [
          { path: "$.title", value: "This is a title from a file" }
        ]
      }
    }
  ]
};



