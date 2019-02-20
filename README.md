# BatPadJS
Create Automated REST API Tests in seconds using BatPadJS. It features an easy to use CLI that allows you to initialise a project, create test suites and scripts. It also comes with built-in features that generates JSON request data dynamically as well as validate response data in a declarative, specification-based approach.

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
  "name": "Sample BatPadJS Test Suite",
  "configs": {
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "defaultEndpoint": "/posts",
    "defaultMethod": "post",  
    "defaultBody": {
      "id": 123456,
      "title": "Using Default Body from Configs",
      "body": "This test uses default body from test suite configs"
    }, 
    "beforeAllScript": "scripts/beforeAllScript.js"
  },
  "scenarios": [
    {
      "test": "Sample @smoke test scenario",
      "request": {
        "url": "/posts",
        "method": "post",
        "bodyPath": "data/bodyFromFile.json"
      },
      "expected": {
        "status": 201,
        "data": [
          { "path": "$.title", "equals": "Using Default Body Title from Configs updated in BeforeAll script" },
          { "path": "$.body", "contains": "BeforeAll" },
          { "path": "$.body", "notcontains": "test suite" }
        ]
      }
    }
  ]
}

```

__**Configuration**__

```
baseUrl - Sets the base url to be used in the test suite
defaultEndpoint - Sets a default endpoint
defaultMethod - Sets the default REST method
defaultBody - Sets the default JSON Body for use in the test scenarios
defaultBodyPath - Sets the default JSON Body File Path for use in the test scenarios
beforeAllScript - Sets the beforeAllScript path inside the scripts folder
beforeEachScript - Sets the beforeEachScript path inside the scrips folder
afterEachScript - Sets the afterEachScript path inside the scripts folder
afterAllScript - Sets the afterAllScript path inside the script folder
```

__**Scenarios**__
```
test - Test Scenario Name or Description
request - Sets the Request Details
expected - Sets the Expected Results

```

__Request__
```
url - Sets the endpoint to be used in the scenario
method - Sets the REST method for the scenario. Overrides the defaultMethod from the Configs
headers - Sets the Request Headers
params - Sets the Request Parameters
body - Sets the Request Body JSON
bodyPath - Sets the Request Body JSON File Path. Overrides the defaultBodyPath from the configs
```

__Expected__
```
status - Sets the expected status code
statusText - Sets the expected status text
data - Sets the expected data where you specify the JSON path and the Validation Method such as equals, contains or notcontains
```

## Built With

* [axios](https://github.com/axios/axios) - HTTP Client used
* [jsonpath](https://github.com/dchester/jsonpath) - Used to manipulate JSON Data
* [yargs](https://github.com/yargs/yargs) - Used to create the CLI
* [bluebird](https://github.com/petkaantonov/bluebird) - Promise Library
* [throat](https://github.com/ForbesLindesay/throat) - Used to throttle parallelism
* [moment](https://github.com/moment/moment) - Used for Date and Time stuff
* [chalk](https://github.com/chalk/chalk) - Made the logging colorful
* [shelljs](https://github.com/shelljs/shelljs) - Cross Environment Shell

## Authors

* Marc Dacanay ([Github](https://github.com/marcdacz) | [LinkedIn](https://www.linkedin.com/in/marcdacanay/))

## License

This project is licensed under the MIT License.

