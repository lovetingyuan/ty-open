/**
 * to write and read config file
 */
const fs = require('fs');
const path = require('path');
const handleError = require('./utils').handleError;
const pkg = require('../package.json');
const Ajv = require('ajv');

/**
 * get config or write config
 * newConfig: Object, the new config obj to write
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

const configDirPath = path.resolve(__dirname, '../config');
const configFilePath = path.resolve(configDirPath, 'config.json');
if (!fs.existsSync(configDirPath)) {
  fs.mkdirSync(configDirPath);
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
} else if (!fs.existsSync(configFilePath)) {
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
}

const configSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    version: {
      type: 'string',
      format: 'regex',
      pattern: '^(\\d+\\.)?(\\d+\\.)?\\d+$',
    },
    sites: {
      type: 'object',
      id: 'sites',
      additionalProperties: {
        type: 'object',
        properties: {
          sub: {
            $ref: 'sites',
          },
          url: {
            type: 'string',
          },
          default: {
            type: 'string',
          },
        },
        required: ['sub'],
        additionalProperties: false,
      },
    },
  },
};

/**
 * read or write config file
 * @param {object} newConfig
 */
function configure(newConfig) {
  if (!newConfig) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(configFilePath);
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

function checkConfig(config) {
  const ajv = new Ajv();
  return ajv.validate(configSchema, config);
}

module.exports = {
  configure,
  resetConfig,
  copyConfig,
  checkConfig,
};
