/**
 * @author tingyuan
 */
const minimist = require('minimist');
const pkg = require('../package.json');
const configure = require('./config').configure;

const {
  showUsage,
  handleError,
  onlyHas,
} = require('./utils');

const {
  open,
  checkUrl,
  hasProtocol,
} = require('./urls');

const funcs = require('./main');

const { visit, subCmds } = funcs;
const actions = {};
subCmds.forEach((cmd) => { actions[cmd] = funcs[cmd]; });
module.exports = function start(argvs) {
  const args = minimist(argvs || process.argv.slice(2));
  const command = args._[0];
  const noOptions = args._.slice(1);
  delete args._;
  const options = args;
  configure(); // init config file
  if (!command) {
    if (Object.keys(options).length === 0) {
      visit('home');
    } else if (onlyHas(['h', 'help', 'v', 'version'], options)) {
      if (options.h || options.help) {
        showUsage();
      }
      if (options.v || options.version) {
        console.log(`${pkg.name}: v${pkg.version}`); // eslint-disable-line no-console
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
