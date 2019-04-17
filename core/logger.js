const chalk = require("chalk");

const { log } = console;

const warn = (message) => {
  log(chalk.yellow(message));
};

const error = (message) => {
  log(chalk.red(message));
};

const success = (message) => {
  log(chalk.green(message));
};

const info = (message) => {
  log(chalk.cyan(message));
};

const keyValue = (key, value) => {
  log(chalk.cyan(key), chalk.gray(value));
};

const data = (message) => {
  log(chalk.gray(message));
};

const lines = (count = 1) => {
  while (count > 0) {
    log('');
    count--;
  }
};

const passedTest = (test, duration) => {
  log(chalk.green('\u2713'), chalk.gray(test), chalk.green(`[${duration}]`));
};

const failedTest = (test, duration) => {
  log(chalk.red('\u2715'), chalk.gray(test), chalk.red(`[${duration}]`));
};

const failedTestContext = (context) => {
  context.map(ctxt => { log(chalk.yellow(JSON.stringify(ctxt, null, 2))); })
};

module.exports = {
  error,
  warn,
  success,
  info,
  keyValue,
  data,
  lines,
  passedTest,
  failedTest,
  failedTestContext
};