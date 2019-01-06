module.exports = async (scenario) => {
  let request = scenario.request;
  let body = require(request.body);

  if (request.fields) {
    for (const field of request.fields) {
      jsonpath.value(body, field.path, field.value)
    }
  }
};
