#!/usr/bin/env node
console.log(`Oh hey guys, its me BatPad... cool!!!`);

const testRunner = require("../core/util/runTest");

const testSuite = require("../batpad");
testRunner.runTests(testSuite);
