const jsonpath = require('jsonpath');
const fs = require('fs');

module.exports = class JsonBuilder {
	constructor(json) {
		this._json = {};
		if (json) {
			this._json = json;
		}
	}

	add(path, value) {
		jsonpath.value(this._json, path, value);
		return this;
	}

	update(path, value) {
		jsonpath.apply(this._json, path, (fieldValue) => {
			return value;
		});
		return this;
	}

	delete(path) {
		jsonpath.apply(this._json, path, (fieldValue) => {
			return undefined;
		});
		return this;
	}

	getAll(path) {
		return jsonpath.query(this._json, path);
	}

	get(path) {
		return jsonpath.value(this._json, path);
	}

	save(filename) {
		fs.writeFileSync(filename, JSON.stringify(this._json, null, 2));
	}
};
