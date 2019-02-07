exports.command = 'testsuite [name]'
exports.aliases = ['test', 't']
exports.desc = 'Generate batpad testsuite'
exports.builder = {
  name: {
    default: 'sampleTest'
  }
}
exports.handler = function (argv) {
  console.log('generate test suite', argv.name)
}