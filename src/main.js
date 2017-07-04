const path = require('path');
const {
  configure,
  resetConfig,
  copyConfig,
  checkConfig,
} = require('./config');
const {
  handleError,
  prompt,
  log,
  mergeDeep,
} = require('./utils');
const {
  hasProtocol,
  checkUrl,
  open,
} = require('./urls');
const {
  getValue,
  setValue,
  delValue,
  hasValue,
} = require('./value');
const {
  tree,
  list,
} = require('./list');

const subCmds = ['ls', 'add', 'rm', 'bak', 'res'];

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
  const name = args[0];
  let url = args[1];
  if (!name || !url) handleError('you can not add a site without "name" or "url"');
  if (subCmds.indexOf(name) !== -1) {
    handleError(`you can not use ${subCmds.map(v => `"${v}"`).join(' or ')} as a site name`);
  }
  checkUrl(url, opts.f || opts.force);
  const config = configure();
  url = hasProtocol(url) ? url : `http${(opts.s || opts.ssl) ? 's' : ''}://${url}`;
  setValue(name, config.sites, url, opts.d || opts.default);
  configure(config);
  log(`have added the site ${name}`, 'success');
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
  const config = configure();
  const site = getValue(name, config.sites);
  let url = site.url;
  const def = site.default || url;
  if (args.length) {
    for (let i = 0; i < args.length; i++) {
      url = url.replace(' ', args[i]);
    }
  } else {
    url = def || url;
  }
  open(url);
}

/**
 * delete a site
 * @param {array} args - site name
 * @param {object} opts - valid: -c, --children delete children, -f, --force, delete without prompt
 */
function rm(args, opts) {
  const name = args[0];
  if (!name) {
    prompt('are you sure to delete all sites!?(y/n)', (yes) => {
      if (yes) resetConfig();
      process.exit(0);
    });
    return;
  }
  const config = configure();
  const delSub = opts.c || opts.children;
  hasValue(name, config.sites);
  const del = function del() {
    delValue(name, config.sites, delSub);
    configure(config);
    log(`have delete ${name}`, 'success');
  };
  if (opts.f || opts.force) {
    del();
  } else {
    prompt(`are you sure to delete site: ${name}?(y/n)`, (yes) => {
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
  const name = args[0];
  const config = configure();
  const obj = name ? getValue(name, config.sites) : config.sites;
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
  const dist = copyConfig(args[0] || process.cwd());
  log(`the config file has been save to ${dist}`, 'success');
}

function res(args, opts) {
  if (!args[0]) {
    handleError('you must specify the config file path');
  }
  const configPath = path.resolve(process.cwd(), args[0]);
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const restoreConfig = require(configPath);
    if (!checkConfig(restoreConfig)) {
      handleError('invalid config format!');
    }
    if (opts.m || opts.merge) {
      const config = configure();
      configure(mergeDeep(config, restoreConfig));
      log('the config file has been saved', 'success');
    } else {
      prompt('are you sure to cover current sites?(y/n)', (yes) => {
        if (yes) {
          configure(restoreConfig);
          log('the config file has been saved', 'success');
        }
        process.exit(0);
      });
    }
  } catch (e) {
    handleError(`the config file is invalid, please check the path: ${configPath}`);
  }
}

module.exports = {
  add,
  rm,
  ls,
  bak,
  res,
  visit,
  subCmds,
};
