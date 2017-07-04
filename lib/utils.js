'use strict';

var readline = require('readline');
var chalk = require('chalk');
var mergeDeep = require('deepmerge');

function log(content) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';

  var print = {
    error: chalk.red,
    success: chalk.green,
    warning: chalk.yellow,
    info: chalk.white
  };
  console.log(print[type](content)); // eslint-disable-line no-console
}

function showUsage() {
  var help = ' \nusage: to [command] [args...] [options] \ncommands: add, ls, rm, bak, res\n  add, add a site, eg: to add npm "https://www.npmjs.com/" \n    options: -s, -d \n      -s, --ssl, use "https" as the protocol, no need to specify it \n      -d, --default, set default url (used when no arguments are provided)\n      -f, --force, add a site without checking the url\n  ls, list sites, eg: to ls npm \n    options: -t \n      -t, --tree, will list the sites in a tree \n  rm, delete a site, eg: to rm npm \n    options: -f, -c \n      -f, --force, delete the site without prompt \n      -c, --children, only delete the children sites under the namespace \n  bak, export current config file, eg: to bak [path], default path is current dir\n  res, import config file, eg: to res <config_file_path>\n    options: -m\n      -m, --merge, merge custom config file and current config file, default is false\n      \nwhen command is the site name or a valid url, will open the default browser directly \neg: to npm, will open "https://www.npmjs.com" \n  ';
  log(help);
}

function handleError(errorMsg) {
  log('Sorry, ' + errorMsg, 'error');
  showUsage();
  process.exit(-1);
}

function onlyHas(keyList, obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    if (keyList.indexOf(keys[i]) === -1) return false;
  }
  return true;
}

function prompt(question, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var cb = function cb(result) {
    if (!result) {
      callback(false);
    } else {
      var answer = result.toLowerCase();
      callback(answer === 'y' || answer === 'yes');
    }
  };

  rl.question(question, function (answer) {
    rl.close();
    cb(answer);
  });
}

module.exports = {
  handleError: handleError,
  showUsage: showUsage,
  onlyHas: onlyHas,
  prompt: prompt,
  log: log,
  mergeDeep: mergeDeep
};