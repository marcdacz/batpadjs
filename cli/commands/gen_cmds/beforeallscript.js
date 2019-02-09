const { join, basename } = require('path');
const shell = require('shelljs');
const fileHelpers = require(join(__dirname, '../../../core/fileHelpers'));
const log = require(join(__dirname, '../../../core/logger'));

exports.command = 'beforeallscript [name]'
exports.aliases = ['beforeall', 'ba']
exports.desc = 'Generate batpad test suite before all script'
exports.builder = {
  name: {
    default: 'beforeAllScript'
  }
}
exports.handler = function(argv) {
  const settings = fileHelpers.requireUncached(join(process.cwd(), 'settings.json'));
  if (settings) {
    const scriptPath = settings.paths.scripts || 'scripts';
    const src = join(__dirname, `../../scaffolding/scripts/beforeAllScript.js`)
    const dest = join(process.cwd(), `${scriptPath}/${basename(argv.name, '.js')}.js`);
    shell.cp(src, dest)
  } else {
    log.info(`Ensure the project is initialised by running 'batpad init'`)
  }
}