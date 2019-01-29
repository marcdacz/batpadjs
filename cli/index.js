#!/usr/bin/env node
const testRunner = require("../core/util/runTest");
const testSuite = require("../batpad");
testRunner.runTests(testSuite);
