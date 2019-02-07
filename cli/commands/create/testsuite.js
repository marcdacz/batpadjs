exports.command = 'testsuite [name]'
exports.desc = 'Create an empty repo'
exports.builder = {
  dir: {
    default: '.'
  }
}
exports.handler = function (argv) {
  console.log('create called for dir', argv.dir)
}