#!/usr/bin/env node
const args = require('yargs').argv;
const version = require('../package.json').version;

let commandToRun = "";
if (args.init) {
  commandToRun = "init";
} else if (args.test) {
  commandToRun = "test";
} else if (args.report) {
  commandToRun = "report";
} else if (args.h) {
  commandToRun = "help";
} else if (args.v) {
  commandToRun = "version";
} else {
  commandToRun = "help";
}

switch (commandToRun) {
  case "init":
    console.log('Initialise');
    break;
  case "test":
    require("./testSuiteRunner").runTests(args.s, args.f);
    break;
  case "report":
    console.log('Report');
    break;  
  case "version":
    console.log(`BatPadJS v${version}`);
    break;
  case "help":
  default:
    console.log("Help");    
    break;
}

