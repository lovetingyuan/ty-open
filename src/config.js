/**
 * to write and read config file
 */
const fs = require('fs')
const path = require('path')
 
const configFilePath = path.resolve(__dirname, './config.json')
/**
 * get config or write config 
 * newConfig: Object, the new config obj to write
 * 
 */

const defaultConfig = {
  version: require('../package.json').version,
  sites: {
    gg: {
      url: 'https://google.com/search?q= ',
      default: 'https://google.com/'
    }
  }
}

/**
 * read or write config file
 * @param {object} newConfig 
 */
function configure(newConfig) { 
  if (!newConfig) {
    if (fs.existsSync(configFilePath)) {
      return require(configFilePath)
    } else {
      fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2))
      return defaultConfig
    }
  }
  fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2))
}

/**
 * reset config file, clear all user sites
 */
function resetConfig() {
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2))
}

module.exports = {
  configure,
  resetConfig,
}