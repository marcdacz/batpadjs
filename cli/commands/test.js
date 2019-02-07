exports.command = 'test'
exports.aliases = ['t']
exports.nargs = 1
exports.desc = 'Execute batpad tests'
exports.builder = {
  filter: {
    demand: true
  }
}
exports.handler = function (argv) {
  console.log('test called', argv.filter)
}