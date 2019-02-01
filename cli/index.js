#!/usr/bin/env node
const fileHelpers = require("../core/util/fileHelpers")
const testRunner = require("../core/util/testSuiteRunner");

const testSuites = fileHelpers.getJsFiles("./tests");
testSuites.map(testSuite => {
  testRunner.runTests(fileHelpers.requireUncached(testSuite.path));
})

