module.exports = async (testProperties) => {
	let configs = testProperties.configs;
	let JsonBuilder = require('../../index').JsonBuilder;
	configs.body = new JsonBuilder()
		.add('$.title', 'Using Default Body Title from Configs updated in BeforeAll script')
		.add('$.body', 'Using Default Body Title from Configs updated in BeforeAll script')
		.get('$');
};
