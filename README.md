# BatPadJS
Declarative Specification-based API Test Automation Framework

## Start with the Why?
If you find yourself needing to automate with the following requirements:
- You have an API Project
- You also have a massive JSON Body you want to dynamically generate in each of your tests
- You also need to validate a JSON output
- You want easy-to-create and easy-to-read test cases

Then you came at the right place!

### Introducing BatPadJS

Create Automated API Tests in seconds using BatPadJS. It even features an easy to use CLI that allows you to initialise a project, create test suites and scripts. It also comes with built-in features that generates JSON request data dynamically as well as validate response data in a declarative, specification-based approach.

## Getting Started
### Installing

You can install BatPadJS globally to take advantage of the CLI

```
npm install -g batpadjs
```

Or you may install it locally in your project to use it as a module

```
npm install --save batpadjs
```

## Quick Start Guide

### CLI Commands

Initialise a Project
```
batpad init
```
Run your Tests
```
batpad test
batpad test --filter SomeText
```
Generate Additional Test Suites
```
batpad gen testsuite --name SomeName
```
Generate Before/After All Test Scripts which when set, will run before/after all the test scenarios in the test suite and have access to configuration data
```
batpad gen beforeallscript --name SomeName
batpad gen afterallscript --name SomeName
```
Generate Before/BeforeEach/After/AfterEach Test Scripts which when set, will run before/after the test scenario. Both have access to scenario data but after scripts have access to actual API response data
```
batpad gen beforescript --name SomeName
batpad gen aftercript --name SomeName
```

### Test Anatomy
```
{
  name: "Sample Test Suite",
  configs: {
    baseUrl: "{{baseUrl}}",
    url: "/posts",
    method: "post",  
    body: {     
      "title": "Make It So",
      "body": "To Boldly Go Where No Tester Has Gone Before..."
    }, 
    beforeAllScript: "beforeAllScript.js",
    afterAllScript: "afterAllScript.js"
  },
  scenarios: [
    {
      test: "Sample Scenario",
      beforeScript: "beforeScript.js",
      afterScript: "afterScript.js",
      request: {
        url: "/posts",
        method: "post",
        bodyPath: "data/bodyFromFile.json",
        fields: [
          { path: "$.title", value: "Live Long and Prosper" },
          { path: "$.body", value: "Computer, run a level-two diagnostic on warp-drive systems." },
        ]
      },
      expected: {
        status: 201,
        data: [
          { path: "$.title", equals: "Live Long and Prosper" },
          { path: "$.body", contains: "computer" },
          { path: "$.body", notcontains: "StarWars" },
          { path: "$.body", callback: customValidation }
        ]
      }
    }
  ]
};

```
See more [Examples](https://github.com/marcdacz/BatPadJS/tree/master/examples)

**Configuration**

```
baseUrl - Sets the base url to be used in the test suite
url - Sets a default endpoint
method - Sets the default REST method
header - Sets the default Header
proxy - Sets the default Proxy
body - Sets the default JSON Body for use in the test scenarios
bodyPath - Sets the default JSON Body File Path for use in the test scenarios
beforeAllScript - Sets the beforeAllScript path inside the scripts folder
beforeEachScript - Sets the beforeEachScript path inside the scrips folder
afterEachScript - Sets the afterEachScript path inside the scripts folder
afterAllScript - Sets the afterAllScript path inside the script folder
```

**Scenarios**
```
test - Test Scenario Name or Description
request - Sets the Request Details
expected - Sets the Expected Results

```

**Request**
```
url - Sets the endpoint to be used in the scenario
method - Sets the REST method for the scenario (overrides configs)
headers - Sets the Request Headers for the scenario (overrides configs)
proxy - Sets the Request Proxy for the scenario (overrides configs)
params - Sets the Request Parameters for the scenario 
body - Sets the Request Body JSON for the scenario (overrides configs)
bodyPath - Sets the Request Body JSON File Path for the scenario (overrides configs)
fields - An array of JSON paths and their corresponding values you want to insert or update
```

**Expected**
```
status - Sets the expected status code
statusText - Sets the expected status text
data - Sets the expected data where you specify the JSON path and your assetions
```

**Available Assertions**
```
// Example Actual API Response:
data: {
        title: 'Live Long and Prosper',
        body: 'Computer, run a level-two diagnostic on warp-drive systems.',
        tags: [ 'startrek', 'spock', 'enterprise']
}
```
**equals** - Asserts if actual value is equal to expected value.
```
// scenario.expected.data
data: [
        { path: '$.title', equals: 'Live Long and Prosper' }
]
```

**contains** - If actual value is _STRING_ then asserts if it contains expected string. If actual value is _ARRAY_ then asserts if array contains expected object.
```
// scenario.expected.data
data: [
        { path: '$.body', contains: 'computer' },
        { path: '$.tags', contains: 'startrek' }
]
```

**notcontains** - If actual value is _STRING_ then asserts if it does not contain expected string. If actual value is _ARRAY_ then asserts if array does not contain expected object.
```
// scenario.expected.data
data: [
        { path: '$.body', notcontains: 'macintosh' },
        { path: '$.tags', notcontains: 'starwars' }
]
```

**callback** - Allows users to call a specified function for custom validation. Do note that you can add your own properties in the _scenario.expected.data array_ which you can also utilise in your own custom validation.
```
// test.js
const { customValidation } = require('../scripts/customValidation');
.
.
.
// scenario.expected.data
data: [
        { path: "$.body", callback: customValidation, customMessage: "This test has failed. ;-(" }
]


// customValidation.js
const customValidation = (field, actualValue, scenario) => {
  let expectedValue = 'Computer, run a level-two diagnostic on warp-drive systems.';
  if (actualValue != expectedValue) {
    scenario.result.state = 'failed';
    scenario.result.context.push({
      message: field.customMessage,
      path: field.path,
      actual: actualValue,
      expected: expectedValue
    });
  }
};

module.exports = {
  customValidation
}
```

### Global Settings (settings.json)
```
{
  "paths": {    
    "reports": "reports",
    "scripts": "scripts",
    "tests": "tests"
  },
  "configs": {
    "env": "dev",
    "baseUrl": "{{baseUrl}}",
    "method": "get",
    "headers": {
      "authorization": "Bearer token"
    },
    "proxy": {
      "host": "127.0.0.1",
      "port": 9000,
      "auth": {
        "username": "marcDacz",
        "password": "password"
      }
    },
    "asyncLimit": 2,
    "delay": 0,
    "beforeAllScript": "beforeAllScript.js",
    "afterAllScript": "afterAllScript.js"
  },
  "environments": {
    "dev": {
      "baseUrl": "https://jsonplaceholder.typicode.com",
      "statTestUrl": "http://httpstat.us"
    },
    "test": {
      "baseUrl": "https://test.jsonplaceholder.typicode.com",
      "statTestUrl": "http://test.httpstat.us"
    }
  }
}
```

**Settings File**
```
paths - Here we specify the paths for tests, scripts, reports, etc.
configs - Global Configuration to specify default values for environment, baseUrl, etc. Also provides scripts to run Before/After all test suites run
environments - Contains Environment Variables
```
### Additional Features

**JSON Builder**

By installing BatPadJS locally, you can utilise its built-in JSON Builder:
```
let JsonBuilder = require('batpadjs').JsonBuilder;
configs.body = new JsonBuilder()
  .set('$.title', 'Beam Me Up, Scotty')
  .set('$.body', 'To Boldly Go Where No Tester Has Gone Before...')
  .get('$');
```

## Development
```
npm install 

npm run unit-test

npm run sys-test
```

Note: To test the CLI locally, you can use _npm link_ command

### Built With

* [axios](https://github.com/axios/axios) - HTTP Client used
* [jsonpath](https://github.com/dchester/jsonpath) - Used to manipulate JSON Data
* [yargs](https://github.com/yargs/yargs) - Used to create the CLI
* [bluebird](https://github.com/petkaantonov/bluebird) - Promise Library
* [throat](https://github.com/ForbesLindesay/throat) - Used to throttle parallelism
* [moment](https://github.com/moment/moment) - Used for Date and Time stuff
* [chalk](https://github.com/chalk/chalk) - Made the logging colorful
* [shelljs](https://github.com/shelljs/shelljs) - Cross Environment Shell

### Authors

* Marc Dacanay ([Github](https://github.com/marcdacz) | [LinkedIn](https://www.linkedin.com/in/marcdacanay/))

## License

This project is licensed under the MIT License.

