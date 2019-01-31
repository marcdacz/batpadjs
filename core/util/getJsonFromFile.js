const fs = require("fs");
const path = require("path");
const requireUncached = require("./requireUncached");
const log = require("./logger");

module.exports = filePath => {
  if (filePath) {
    let resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      return requireUncached(resolvedPath);
    } else {
      log.warn(`WARNING: Json file not found: ${filePath}`);
    }
  }
};