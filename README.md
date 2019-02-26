# BatPadJS
Declarative Specification-based REST API Test Automation Framework

## Start with the Why?
If you find yourself needing to automate with the following requirements:
- You have a RESTful API Project
- You also have a massive JSON Body you want to dynamically generate
- You also need to validate a JSON output
- You want an easy-to-create and easy-to-read test cases

Then you came at the right place!

_Introducing BatPadJS_

Create Automated REST API Tests in seconds using BatPadJS. It even features an easy to use CLI that allows you to initialise a project, create test suites and scripts. It also comes with built-in features that generates JSON request data dynamically as well as validate response data in a declarative, specification-based approach.

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
defaultEndpoint - Sets a default endpoint
defaultMethod - Sets the default REST method
defaultBody - Sets the default JSON Body for use in the test scenarios
defaultBodyPath - Sets the default JSON Body File Path for use in the test scenarios
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
method - Sets the REST method for the scenario. Overrides the defaultMethod from the Configs
headers - Sets the Request Headers
params - Sets the Request Parameters
body - Sets the Request Body JSON
bodyPath - Sets the Request Body JSON File Path. Overrides the defaultBodyPath from the configs
fields - An array of JSON paths and their corresponding values you want to insert or update
```

**Expected**
```
status - Sets the expected status code
statusText - Sets the expected status text
data - Sets the expected data where you specify the JSON path and the Validation Method such as _equals_, _contains_ or _notcontains_ as well as having a _callback_ for customValidation method. You can also add custom properties you can use in the _callback_ function!
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

