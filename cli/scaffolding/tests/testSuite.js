module.exports = {
  name: "Sample Test Suite",
  configs: {
    baseUrl: "{{baseUrl}}"
  },
  scenarios: [
    {
      test: "Sample Test Scenario",
      request: {
        url: "/posts",
        method: "post",
        body: {
          id: 123456,
          title: "Live Long and Prosper",
          body: "Computer, run a level-two diagnostic on warp-drive systems."
        }
      },
      expected: {
        status: 201,
        data: [
          { path: "$.title", value: "Live Long and Prosper" }
        ]
      }
    }
  ]
};



