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

1. Initialise a Project

```
batpad init
```
2. Run your Tests
```
batpad test
batpad test --filter SomeText
```
3. Generate Additional Test Suites
```
batpad gen testsuite --name SomeName
```
4. Generate Before/After All Test Scripts which when set, will run before all the test scenarios in the test suite and has access to configuration data
```
batpad gen beforeallscript --name SomeName
batpad gen afterallscript --name SomeName
```
5. Generate Before/BeforeEach/After/AfterEach Test Scripts which when set, will run before the test scenario has access to scenario data
```
batpad gen beforescript --name SomeName
batpad gen aftercript --name SomeName
```

### Test Anatomy

__**Configuration**__

```
*baseUrl* - Sets the base url to be used in the test suite
*defaultEndpoint* - Sets a default endpoint
*defaultMethod* - Sets the default REST method
*defaultBody* - Sets the default JSON Body for use in the test scenarios
*defaultBodyPath* - Sets the default JSON Body File Path for use in the test scenarios
*beforeAllScript* - Sets the beforeAllScript path inside the scripts folder
*beforeEachScript* - Sets the beforeEachScript path inside the scrips folder
*afterEachScript* - Sets the afterEachScript path inside the scripts folder
*afterAllScript* - Sets the afterAllScript path inside the script folder
```

__**Scenarios**__
```
*test* - Test Scenario Name or Description
*request* - Sets the Request Details
*expected* - Sets the Expected Results

```

__Request__
```
*url* - Sets the endpoint to be used in the scenario
*method* - Sets the REST method for the scenario. Overrides the defaultMethod from the Configs
*headers* - Sets the Request Headers
*params* - Sets the Request Parameters
*body* - Sets the Request Body JSON
*bodyPath* - Sets the Request Body JSON File Path. Overrides the defaultBodyPath from the configs
```

__Expected__
```
*status* - Sets the expected status code
*statusText* - Sets the expected status text
*data* - Sets the expected data where you specify the JSON path and the Validation Method such as equals, contains or notcontains
```

## Built With

* [axios](https://github.com/axios/axios) - HTTP Client used
* [jsonpath](https://github.com/dchester/jsonpath) - Used to manipulate JSON Data
* [yargs](https://github.com/yargs/yargs) - Used to create the CLI

and many more...

## Authors

* **Marc Dacanay** - *Initial work* - [marcDacz](https://github.com/marcdacz)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

