const jsonpath = require('jsonpath');
const fs = require('fs');

module.exports = class JsonBuilder {
  constructor(json) {
    this._json = {};
    if (json) {
      this._json = json;
    }
  }

  set(path, value) {
    jsonpath.value(this._json, path, value);
    return this;
  }

  get(path) {
    return jsonpath.value(this._json, path);
  }

  save(filename) {
    fs.writeFileSync(filename, JSON.stringify(this._json, null, 2));
  }
} 
