describe('Core: JsonBuilder Tests', () => {
  const chai = require('chai');
  const expect = chai.expect;
  const JsonBuilder = require('../../core/jsonBuilder');
  let json;

  beforeEach(() => {
    json = {
      firstName: 'Marc',
      lastName: 'Dacz',
      address: {
        suburb: 'Mernda',
        city: 'Melbourne',
        state: 'VIC'
      }
    }
  });

  it('should be able to initialise with empty json', () => {
    let jb = new JsonBuilder();
    expect(jb.get('$')).to.deep.equal({});
  });

  it('should be able to initialise existing json', () => {
    let jb = new JsonBuilder(json);
    expect(jb.get('$')).to.deep.equal(json);
  });

  it('should be able to set json path values - null', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.nullValue', null);
    expect(jb.get('$.nullValue')).to.deep.equal(null);
  });

  it('should be able to set json path values - string', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.alias', 'marcDacz');
    expect(jb.get('$.alias')).to.deep.equal('marcDacz');
  });

  it('should be able to set json path values - number', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.age', 21);
    expect(jb.get('$.age')).to.deep.equal(21);
  });

  it('should be able to set json path values - float', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.height', 182.88);
    expect(jb.get('$.height')).to.deep.equal(182.88);
  });

  it('should be able to set json path values - boolean', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.isHandsome', true);
    expect(jb.get('$.isHandsome')).to.deep.equal(true);
  });

  it('should be able to set json path values - array', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.hobbies', ['pc games', 'eating', 'watching movies']);
    expect(jb.get('$.hobbies')).to.deep.equal(['pc games', 'eating', 'watching movies']);
  });

  it('should be able to set json path values - object', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.contacts', {
      phone: '6123456789',
      email: 'marcdacz@mail.com'
    });
    expect(jb.get('$.contacts')).to.deep.equal({
      phone: '6123456789',
      email: 'marcdacz@mail.com'
    });
  });

  it('should be able to set json path values - undefined', () => {
    let jb = new JsonBuilder(json);
    jb.set('$.address', undefined);
    expect(jb.get('$.address')).to.deep.equal(undefined);
  });
});