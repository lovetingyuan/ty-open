'use strict';

var path = require('path');

var _require = require('./config'),
    configure = _require.configure,
    resetConfig = _require.resetConfig,
    copyConfig = _require.copyConfig,
    checkConfig = _require.checkConfig;

var _require2 = require('./utils'),
    handleError = _require2.handleError,
    prompt = _require2.prompt,
    log = _require2.log,
    mergeDeep = _require2.mergeDeep;

var _require3 = require('./urls'),
    hasProtocol = _require3.hasProtocol,
    checkUrl = _require3.checkUrl,
    open = _require3.open;

var _require4 = require('./value'),
    getValue = _require4.getValue,
    setValue = _require4.setValue,
    delValue = _require4.delValue,
    hasValue = _require4.hasValue;

var _require5 = require('./list'),
    tree = _require5.tree,
    list = _require5.list;

var subCmds = ['ls', 'add', 'rm', 'bak', 'res'];

/**
 * to add a site
 * options:
 *  -d(--default, add to default),
 *  -s(--ssl, if omit protocal, add https://),
 *  -f(--force, force to add a site without checking url)
 * @param {array} args - the site name
 * @param {object} opts - the site address
 */
function add(args, opts) {
  var name = args[0];
  var url = args[1];
  if (!name || !url) handleError('you can not add a site without "name" or "url"');
  if (subCmds.indexOf(name) !== -1) {
    handleError('you can not use ' + subCmds.map(function (v) {
      return '"' + v + '"';
    }).join(' or ') + ' as a site name');
  }
  checkUrl(url, opts.f || opts.force);
  var config = configure();
  url = hasProtocol(url) ? url : 'http' + (opts.s || opts.ssl ? 's' : '') + '://' + url;
  setValue(name, config.sites, url, opts.d || opts.default);
  configure(config);
  log('have added the site ' + name, 'success');
}

/**
 * open site by the given name
 * @param {string} name - site name
 * @param {array} args - params in url
 */
function visit(name, args) {
  if (!name) {
    handleError('you can not omit site name');
  }
  var config = configure();
  var site = getValue(name, config.sites);
  var url = site.url || '';
  var def = site.default || url;
  if (args.length) {
    for (var i = 0; i < args.length; i++) {
      url = url.replace(' ', args[i]);
    }
  } else {
    url = def || url;
  }
  if (!url) {
    handleError('no url for site: ' + name + ', please use "to add ' + name + '" to specify it');
  }
  open(url);
}

/**
 * delete a site
 * @param {array} args - site name
 * @param {object} opts - valid: -c, --children delete children, -f, --force, delete without prompt
 */
function rm(args, opts) {
  var name = args[0];
  if (!name) {
    prompt('are you sure to delete all sites!?(y/n)', function (yes) {
      if (yes) resetConfig();
      process.exit(0);
    });
    return;
  }
  var config = configure();
  var delSub = opts.c || opts.children;
  hasValue(name, config.sites);
  var del = function del() {
    delValue(name, config.sites, delSub);
    configure(config);
    log('have delete ' + name, 'success');
  };
  if (opts.f || opts.force) {
    del();
  } else {
    prompt('are you sure to delete site: ' + name + '?(y/n)', function (yes) {
      if (yes) del();
      process.exit(0);
    });
  }
}

/**
 * print site info
 * @param {array} args - site name
 * @param {object} opts - valid: -t, --tree, print site info by tree
 */
function ls(args, opts) {
  var name = args[0];
  var config = configure();
  var obj = name ? getValue(name, config.sites) : config.sites;
  if (opts.t || opts.tree) {
    tree(obj);
  } else {
    list(obj);
  }
}

/**
 * export current config file
 * @param {array} args
 */
function bak(args) {
  var dist = copyConfig(args[0] || process.cwd());
  log('the config file has been save to ' + dist, 'success');
}

function res(args, opts) {
  if (!args[0]) {
    handleError('you must specify the config file path');
  }
  var configPath = path.resolve(process.cwd(), args[0]);
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    var restoreConfig = require(configPath);
    if (!checkConfig(restoreConfig)) {
      handleError('invalid config format!');
    }
    if (opts.m || opts.merge) {
      var config = configure();
      configure(mergeDeep(config, restoreConfig));
      log('the config file has been saved', 'success');
    } else {
      prompt('are you sure to cover current sites?(y/n)', function (yes) {
        if (yes) {
          configure(restoreConfig);
          log('the config file has been saved', 'success');
        }
        process.exit(0);
      });
    }
  } catch (e) {
    handleError('the config file is invalid, please check the path: ' + configPath);
  }
}

module.exports = {
  add: add,
  rm: rm,
  ls: ls,
  bak: bak,
  res: res,
  visit: visit,
  subCmds: subCmds
};