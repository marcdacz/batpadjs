describe('Core: TimeHelper Tests', () => {
  const moment = require('moment');
  const chai = require('chai');
  const expect = chai.expect;
  const timeHelpers = require('../../core/timeHelpers');

  it('should be able to get duration between time in seconds', () => {
    let start = moment();
    let end = moment().add(10, 'seconds');

    let duration = timeHelpers.getDuration(start, end);
    expect(duration).to.be.equal('10.00s');
  });

  it('should be able to get duration between time in minutes', () => {
    let start = moment();
    let end = moment().add(61, 'seconds');

    let duration = timeHelpers.getDuration(start, end);
    expect(duration).to.be.equal('1.02mins');
  });

  it('should be able to get duration between time in hours', () => {
    let start = moment();
    let end = moment().add(61, 'minutes');

    let duration = timeHelpers.getDuration(start, end);
    expect(duration).to.be.equal('1.02hrs');
  });
});