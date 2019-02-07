exports.command = 'report'
exports.aliases = ['r']
exports.nargs = 1
exports.desc = 'Display batpad test report'
exports.builder = {
}
exports.handler = function (argv) {
  console.log('open report called')
}