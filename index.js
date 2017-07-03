/**
 * @author tingyuan
 */
const minimist = require('minimist')
const pkg = require('./package.json')

const {
  showUsage,
  handleError,
  onlyHas,
} = require('./src/utils')

const {
  open,
  checkUrl,
  hasProtocol,
} = require('./src/urls')

const funcs = require('./src/main')
const actions = {
  add,
  rm,
  ls,
  bak
} = funcs
const { visit } = funcs

module.exports = function start(argvs) {
  const args = minimist(argvs || process.argv.slice(2))
  const command = args._[0]
  const noOptions = args._.slice(1)
  delete args._
  const options = args
  if (!command) {
    if (Object.keys(options).length === 0) {
      visit('home')
    } else if (onlyHas(['h', 'help', 'v', 'version'], options)) {
      if (options.h || options.help) {
        showUsage()
      }
      if (options.v || options.version) {
        console.log(pkg.name + ': v' + pkg.version)
      }
    } else {
      handleError('unknown options')
    }
  } else if (actions.hasOwnProperty(command)) {
    actions[command](noOptions, options)
  } else if (hasProtocol(command) && checkUrl(command)) {
    open(command)
  } else {
    visit(command, noOptions, options)
  }
}
