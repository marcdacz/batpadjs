describe.only('Core: ResponseScript Tests', () => {
    const moment = require('moment');
    const chai = require('chai');
    const expect = chai.expect;
    const responseScript = require('../../core/responseScript');
    let scenario;

    beforeEach(() => {
        scenario = {};
        scenario.result = {};
        scenario.result.context = [];
        scenario.result.state = 'passed';
        scenario.result.start = moment();
    });

    it('should fail when scenario.expected is not set', async () => {
        await responseScript(scenario);
        expect(scenario.result.state).to.be.equal('failed');
        expect(scenario.result.context).to.deep.include({ error: `No expected results!` });
    });

    it('should fail when scenario.actualRespons is not defined', async () => {
        scenario.expected = {}
        await responseScript(scenario);
        expect(scenario.result.state).to.be.equal('failed');
        expect(scenario.result.context).to.deep.include({ error: `Response is undefined! Check your request then try again.` });
    });

    it('should validate status - passed', async () => {
        scenario.expected = { status: 200 };
        let actualResponse = { status: 200 };

        await responseScript(scenario, actualResponse);
        expect(scenario.result.state).to.be.equal('passed');
    });

    it('should validate status - failed', async () => {
        scenario.expected = { status: 200 };
        let actualResponse = { status: 201 };

        await responseScript(scenario, actualResponse);
        expect(scenario.result.state).to.be.equal('failed');
        expect(scenario.result.context).to.deep.include({
            error: "Response status is incorrect!",
            actual: 201,
            expected: 200
        });
    });

    it('should validate statusText - passed', async () => {
        scenario.expected = { statusText: 'Success' };
        let actualResponse = { statusText: 'Success' };

        await responseScript(scenario, actualResponse);
        expect(scenario.result.state).to.be.equal('passed');
    });

    it('should validate statusText - failed', async () => {
        scenario.expected = { statusText: 'Success' };
        let actualResponse = { statusText: 'Bad Request' };

        await responseScript(scenario, actualResponse);
        expect(scenario.result.state).to.be.equal('failed');
        expect(scenario.result.context).to.deep.include({
            error: "Response status text is incorrect!",
            actual: 'Bad Request',
            expected: 'Success'
        });
    });
});