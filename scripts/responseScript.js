module.exports = async (scenario) => {
	var response = scenario.response;

	if (response.fields) {
		for (const field of response.fields) {          
			expect(jsonpath.value(res.body, field.path)).to.equal(jsonpath.value(data, field.path))
		}
	}

	if (response.matchStrings) {
		for (const matchString of response.matchStrings) {          
			expect(res.text.match(matchString)).to.not.be.null
		}
	}
};
