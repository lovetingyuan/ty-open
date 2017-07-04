'use strict';

/**
 * @author tingyuan
 */
var minimist = require('minimist');
var pkg = require('../package.json');

var _require = require('./utils'),
    showUsage = _require.showUsage,
    handleError = _require.handleError,
    onlyHas = _require.onlyHas;

var _require2 = require('./urls'),
    open = _require2.open,
    checkUrl = _require2.checkUrl,
    hasProtocol = _require2.hasProtocol;

var funcs = require('./main');

var visit = funcs.visit,
    subCmds = funcs.subCmds;

var actions = {};
subCmds.forEach(function (cmd) {
  actions[cmd] = funcs[cmd];
});
module.exports = function start(argvs) {
  var args = minimist(argvs || process.argv.slice(2));
  var command = args._[0];
  var noOptions = args._.slice(1);
  delete args._;
  var options = args;
  if (!command) {
    if (Object.keys(options).length === 0) {
      visit('home');
    } else if (onlyHas(['h', 'help', 'v', 'version'], options)) {
      if (options.h || options.help) {
        showUsage();
      }
      if (options.v || options.version) {
        console.log(pkg.name + ': v' + pkg.version); // eslint-disable-line no-console
      }
    } else {
      handleError('unknown options');
    }
  } else if (subCmds.indexOf(command) >= 0) {
    actions[command](noOptions, options);
  } else if (hasProtocol(command) && checkUrl(command)) {
    open(command);
  } else {
    visit(command, noOptions, options);
  }
};