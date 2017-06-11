/**
 * @author tingyuan
 */

var utils = require('./lib/utils')
var showUsage = utils.showUsage
var handleError = utils.handleError
var onlyHas = utils.onlyHas


var urls = require('./lib/urls') 
var open = urls.open
var checkUrl = urls.checkUrl
var hasProtocol = urls.hasProtocol

var minimist = require('minimist')
var pkg = require('./package.json')
var funcs = require('./lib/main')
var add = funcs.add
var ls = funcs.ls
var rm = funcs.rm
var visit = funcs.visit

module.exports = function start(argvs) {
  var args = minimist(argvs || process.argv.slice(2))
  var actions = {
    add: add,
    rm: rm,
    ls: ls
  }
  var command = args._[0]
  var noOptions = args._.slice(1)
  delete args._
  var options = args
  if(!command) {
    if(Object.keys(options).length === 0) {
      visit('home')
    } else if(onlyHas(['h', 'help', 'v', 'version'], options)) {
      if(options.h || options.help) {
        showUsage()
      }
      if(options.v || options.version) {
        console.log(pkg.name + ': v' + pkg.version)
      }
    } else {
      handleError('unknown options')
    }
  } else if (actions.hasOwnProperty(command)) {
    actions[command](noOptions, options)
  } else if(hasProtocol(command) && checkUrl(command)) {
    open(command)
  } else {
    visit(command, noOptions, options)
  }
}
