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
    const filePath = path.resolve(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      return getJsFiles(filePath, result);
    }

    if (file.indexOf(".js") > 0) {
      result.push(filePath);
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
