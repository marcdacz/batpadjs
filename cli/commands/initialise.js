const { join, resolve } = require('path');
const shell = require('shelljs');

exports.command = 'initialise'
exports.aliases = ['init', 'i']
exports.desc = 'Initialise batpad test framework'
exports.builder = {}
exports.handler = (argv) => {
  const src = join(__dirname, '../scaffolding/*')
  const dest = process.cwd();
  shell.cp('-Rf', src, dest)
}