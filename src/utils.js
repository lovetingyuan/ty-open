const readline = require('readline');
const chalk = require('chalk');
const mergeDeep = require('deepmerge');

function log(content, type = 'info') {
  const print = {
    error: chalk.red,
    success: chalk.green,
    warning: chalk.yellow,
    info: chalk.white,
  };
  console.log(print[type](content)); // eslint-disable-line no-console
}


function showUsage() {
  const help = ` 
usage: to [command] [args...] [options] 
commands: add, ls, rm, bak, res
  add, add a site, eg: to add npm "https://www.npmjs.com/" 
    options: -s, -d 
      -s, --ssl, use "https" as the protocol, no need to specify it 
      -d, --default, set default url (used when no arguments are provided)
      -f, --force, add a site without checking the url
  ls, list sites, eg: to ls npm 
    options: -t 
      -t, --tree, will list the sites in a tree 
  rm, delete a site, eg: to rm npm 
    options: -f, -c 
      -f, --force, delete the site without prompt 
      -c, --children, only delete the children sites under the namespace 
  bak, export current config file, eg: to bak [path], default path is current dir
  res, import config file, eg: to res <config_file_path>
    options: -m
      -m, --merge, merge custom config file and current config file, default is false
      
when command is the site name or a valid url, will open the default browser directly 
eg: to npm, will open "https://www.npmjs.com" 
  `;
  log(help);
}

function handleError(errorMsg) {
  log(`Sorry, ${errorMsg}`, 'error');
  showUsage();
  process.exit(-1);
}

function onlyHas(keyList, obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (keyList.indexOf(keys[i]) === -1) return false;
  }
  return true;
}

function prompt(question, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const cb = function cb(result) {
    if (!result) {
      callback(false);
    } else {
      const answer = result.toLowerCase();
      callback(answer === 'y' || answer === 'yes');
    }
  };

  rl.question(question, (answer) => {
    rl.close();
    cb(answer);
  });
}

module.exports = {
  handleError,
  showUsage,
  onlyHas,
  prompt,
  log,
  mergeDeep,
};
