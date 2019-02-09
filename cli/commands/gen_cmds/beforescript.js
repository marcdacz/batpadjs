const { join, basename } = require('path');
const shell = require('shelljs');
const fileHelpers = require(join(__dirname, '../../../core/fileHelpers'));
const log = require(join(__dirname, '../../../core/logger'));

exports.command = 'beforescript [name]'
exports.aliases = ['before', 'b']
exports.desc = 'Generate batpad test suite before scenario script'
exports.builder = {
  name: {
    default: 'beforeScript'
  }
}
exports.handler = function(argv) {
  const settings = fileHelpers.requireUncached(join(process.cwd(), 'settings.json'));
  if (settings) {
    const scriptPath = settings.paths.scripts || 'scripts';
    const src = join(__dirname, `../../scaffolding/scripts/beforeScript.js`)
    const dest = join(process.cwd(), `${scriptPath}/${basename(argv.name, '.js')}.js`);
    shell.cp(src, dest)
  } else {
    log.info(`Ensure the project is initialised by running 'batpad init'`)
  }
}