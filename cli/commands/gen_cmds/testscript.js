exports.command = 'testscript [name]'
exports.aliases = ['script', 's']
exports.desc = 'Generate batpad testscript'
exports.builder = {
  name: {
    default: 'sampleScript'
  }
}
exports.handler = function (argv) {
  console.log('generate test script', argv.name)
}