module.exports = {
  name: "BatPadJS Tests: Module Test",
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
      response: {
        status: 201,
        fields: [
          { path: "$.title", value: "This is a title from a file" }
        ]
      }
    }
  ]
};



