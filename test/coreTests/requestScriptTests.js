describe('Core: RequestScript Tests', () => {
	const chai = require('chai');
	const expect = chai.expect;
	const requestScript = require('../../core/requestScript');
	let scenario;
	let configs;

	beforeEach(() => {
		scenario = {
			request: {
				fields: [
					{ addPath: '$.address.suburb', value: 'Mernda' },
					{ addPath: '$.address.city', value: 'Melbourne' },
					{ addPath: '$.address.state', value: 'VIC' }
				]
			}
		};
		configs = {
			body: {
				id: 12345,
				firstName: 'Janna',
				lastName: 'Cruz'
			}
		};
	});

	it('should be able to generate json request using configs.body', async () => {
		await requestScript(scenario, configs);
		expect(scenario.request.body).to.deep.equal({
			id: 12345,
			firstName: 'Janna',
			lastName: 'Cruz',
			address: {
				suburb: 'Mernda',
				city: 'Melbourne',
				state: 'VIC'
			}
		});
	});

	it('should be able to generate json request using configs.bodyPath', async () => {
		configs.bodyPath = 'examples/data/bodyFromFile.json';

		await requestScript(scenario, configs);
		expect(scenario.request.body).to.deep.equal({
			id: 123456,
			title: 'This is a title from a file',
			body: 'This is a body from a file',
			address: {
				suburb: 'Mernda',
				city: 'Melbourne',
				state: 'VIC'
			}
		});
	});

	it('should be able to generate json request using scenario.request.bodyPath', async () => {
		scenario.request.bodyPath = 'examples/data/bodyFromFile.json';
		await requestScript(scenario, configs);
		expect(scenario.request.body).to.deep.equal({
			id: 123456,
			title: 'This is a title from a file',
			body: 'This is a body from a file',
			address: {
				suburb: 'Mernda',
				city: 'Melbourne',
				state: 'VIC'
			}
		});
	});

	it('should be able to generate json request using scenario.request.body', async () => {
		scenario.request.body = {
			id: 78910,
			firstName: 'James',
			lastName: 'Salcedo'
		};

		await requestScript(scenario, configs);
		expect(scenario.request.body).to.deep.equal({
			id: 78910,
			firstName: 'James',
			lastName: 'Salcedo',
			address: {
				suburb: 'Mernda',
				city: 'Melbourne',
				state: 'VIC'
			}
		});
	});
});
