/**
 * to write and read config file
 */
const fs = require('fs');
const path = require('path');
const handleError = require('./utils').handleError;
const pkg = require('../package.json');

const configFilePath = path.resolve(__dirname, './config.json');
/**
 * get config or write config
 * newConfig: Object, the new config obj to write
 *
 */

const defaultConfig = {
  version: pkg.version,
  sites: {
    gg: {
      sub: {},
      url: 'https://google.com/search?q= ',
      default: 'https://google.com/',
    },
  },
};

/**
 * read or write config file
 * @param {object} newConfig
 */
function configure(newConfig) {
  if (!newConfig) {
    if (fs.existsSync(configFilePath)) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(configFilePath);
    }
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));
  return null;
}

/**
 * reset config file, clear all user sites
 */
function resetConfig() {
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
}

/**
 * copy config file to given path
 */
function copyConfig(_path) {
  const dist = path.resolve(_path);
  if (!fs.readdirSync(dist)) {
    handleError(`the path: ${dist} does not exist or is not a directory`);
  }
  const config = configure();
  const distDir = path.join(dist,
    `config_${new Date().toISOString().split('.')[0].replace(/:/g, '-')}.json`);
  fs.writeFileSync(distDir, JSON.stringify(config, null, 2));
  return distDir;
}

module.exports = {
  configure,
  resetConfig,
  copyConfig,
};
