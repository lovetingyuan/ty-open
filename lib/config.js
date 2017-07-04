'use strict';

/**
 * to write and read config file
 */
var fs = require('fs');
var path = require('path');
var handleError = require('./utils').handleError;
var pkg = require('../package.json');
var Ajv = require('ajv');

var configFilePath = path.resolve(__dirname, '../config/config.json');
/**
 * get config or write config
 * newConfig: Object, the new config obj to write
 */

var defaultConfig = {
  version: pkg.version,
  sites: {
    gg: {
      sub: {},
      url: 'https://google.com/search?q= ',
      default: 'https://google.com/'
    }
  }
};

var configSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    version: {
      type: 'string',
      format: 'regex',
      pattern: '^(\\d+\\.)?(\\d+\\.)?\\d+$'
    },
    sites: {
      type: 'object',
      id: 'sites',
      additionalProperties: {
        type: 'object',
        properties: {
          sub: {
            $ref: 'sites'
          },
          url: {
            type: 'string'
          },
          default: {
            type: 'string'
          }
        },
        required: ['sub'],
        additionalProperties: false
      }
    }
  }
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
  var dist = path.resolve(_path);
  if (!fs.readdirSync(dist)) {
    handleError('the path: ' + dist + ' does not exist or is not a directory');
  }
  var config = configure();
  var distDir = path.join(dist, 'config_' + new Date().toISOString().split('.')[0].replace(/:/g, '-') + '.json');
  fs.writeFileSync(distDir, JSON.stringify(config, null, 2));
  return distDir;
}

function checkConfig(config) {
  var ajv = new Ajv();
  return ajv.validate(configSchema, config);
}

module.exports = {
  configure: configure,
  resetConfig: resetConfig,
  copyConfig: copyConfig,
  checkConfig: checkConfig
};