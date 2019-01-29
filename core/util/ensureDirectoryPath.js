const path = require("path");
const fs = require("fs");

const ensureDirectoryPath = filePath => {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryPath(dirname);
  fs.mkdirSync(dirname);
};

module.exports = path => {
  return ensureDirectoryPath(path);
};
