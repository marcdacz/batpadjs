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
  log(chalk.cyan.bold(message));
};

module.exports = {
  error,
  warn,
  success,
  info
};