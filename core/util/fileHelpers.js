const path = require("path");
const fs = require("fs");
const log = require("./logger");

const ensureDirectoryPath = filePath => {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryPath(dirname);
  fs.mkdirSync(dirname);
};

const getJsFiles = (dir, result = []) => {
  fs.readdirSync(dir).forEach(file => {
    const name = path.parse(file).name;
    const filePath = path.resolve(dir, file);
    const fileStats = { name, path: filePath };

    if (fs.statSync(filePath).isDirectory()) {
      return getJsFiles(filePath, result);
    }

    if (file.indexOf(".js") > 0) {
      result.push(fileStats);
    }
  });

  return result;
};

const requireUncached = filePath => {
  if (filePath) {
    let resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      delete require.cache[require.resolve(resolvedPath)];
      return require(resolvedPath);
    } else {
      log.warn(`WARNING: File not found: ${filePath}`);
    }
  }
};

module.exports = {
  ensureDirectoryPath,
  getJsFiles,
  requireUncached
};
