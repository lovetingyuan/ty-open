/**
 * to write and read config file
 */
var fs = require('fs')
var path = require('path')
/**
 * get config or write config 
 * newConfig: Object, the new config obj to write
 * 
 */

var defaultConfig = {
  version: require('../package.json').version,
  sites: {
    gg: {
      url: 'https://google.com/search?q= ',
      default: 'https://google.com/'
    }
  }
}
function configure(newConfig) { 
  var configPath = path.resolve(__dirname, './config.json')
  if (!newConfig) {
    if(fs.existsSync(configPath)) {
      return require(configPath)
    } else {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
      return defaultConfig
    }
  }
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))
}

function resetConfig() {
  var configPath = path.resolve(__dirname, './config.json')
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
}

module.exports = {
  configure: configure,
  resetConfig: resetConfig
}