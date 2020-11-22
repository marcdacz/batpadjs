const JsonBuilder = require('./jsonBuilder');
const { requireUncached } = require('./fileHelpers');
const log = require('./logger');

module.exports = async (scenario, configs) => {
	try {
		let bodyFromPath = requireUncached(scenario.request.bodyPath) || requireUncached(configs.bodyPath);
		let configbody = configs.body ? JSON.parse(JSON.stringify(configs.body)) : {};
		scenario.request.body = scenario.request.body || bodyFromPath || configbody;
		if (scenario.request.fields) {
			let jb = new JsonBuilder(scenario.request.body);
			for (const field of scenario.request.fields) {
				if (field.addPath) {
					jb.add(field.addPath, field.value);
				}

				if (field.updatePath) {
					jb.update(field.updatePath, field.value);
				}

				if (field.deletePath) {
					jb.delete(field.deletePath);
				}
			}
		}
	} catch (error) {
		log.failAndExit(error);
	}
};
