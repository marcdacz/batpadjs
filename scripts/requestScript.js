module.exports = async (scenario) => {
	let request = scenario.request;
	let baseJSON = request.baseJSON;

	if (request.fields) {
		for (const field of request.fields) {
			jsonpath.value(baseJSON, field.path, field.value)
		}
	}
};
