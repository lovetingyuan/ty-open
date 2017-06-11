function handleError(errorMsg) {
  console.error('Sorry, ' + errorMsg)
  showUsage()
  process.exit(-1)
}

function showUsage() {
  var help = ' \
  usage: to [command] [args...] [options] \n \
  commands: add, ls, rm \n \
    add, add a site, eg: to add npm "https://www.npmjs.com/" \n \
      options: -s, -d \n \
        -s, --ssl, use "https" as the protocol, no need to specify it \n \
        -d, --default, set default url (used when no arguments are provided) \n \
    ls, list sites, eg: to ls npm \n \
      options: -t \n \
        -t, --tree, will list the sites in a tree \n \
    rm, delete a site, eg: to rm npm \n \
      options: -f, -c \n \
        -f, --force, delete the site without prompt \n \
        -c, --children, only delete the children sites under the namespace \n \
  when command is the site name or a valid url, will open the default browser directly \n \
  eg: to npm, will open "https://www.npmjs.com" \n \
  '
  console.log(help)
}

function onlyHas(keyList, obj) {
  var keys = Object.keys(obj)
  for(var i = 0; i < keys.length; i++) {
    if(keyList.indexOf(keys[i]) === -1) return false
  }
  return true
}

function prompt(question, callback) {
  var readline = require('readline');

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var cb = function(result) {
    if(!result) {
      callback(false)
    } else {
      result = result.toLowerCase()
      callback(result === 'y' || result === 'yes')
    }
  }

  rl.question(question, function (answer) {
    rl.close()
    cb(answer)
  });
}

module.exports = {
  handleError: handleError,
  showUsage: showUsage,
  onlyHas: onlyHas,
  prompt: prompt
}