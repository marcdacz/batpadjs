#!/usr/bin/env node
require('yargs')
  .scriptName('batpad')
  .commandDir('commands')
  .demandCommand()
  .help()
  .argv

