const { 
  configure,
  resetConfig,
} = require('./config')
const {
  handleError,
  onlyHas,
  prompt,
  log
} = require('./utils')
const {
  hasProtocol,
  checkUrl,
  open,
} = require('./urls')
const {
  getValue,
  setValue,
  delValue,
  hasValue,
  flatValue
} = require('./value')
const {
  tree,
  list
} = require('./list')

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
  let name = args[0], url = args[1]
  if (!name || !url) handleError('you can not add a site without "name" or "url"')
  if (['ls', 'add', 'rm'].indexOf(name) !== -1) {
    handleError('sorry, you can not use "ls" or "add" or "rm" as a site name')
  }
  checkUrl(url, opts.f || opts.force)
  const config = configure()
  if (!hasProtocol(url)) {
    if(opts.s || opts.ssl) {
      url = 'https://' + url
    } else {
      url = 'http://' + url
    }
  }
  setValue(name, config.sites, url, opts.d || opts.default)
  configure(config)
  log('have added the site ' + name, 'success')
}

/**
 * open site by the given name
 * @param {string} name - site name
 * @param {array} args - params in url
 * @param {object} opts - options, should be empty for now
 */
function visit(name, args, opts) { 
  if (!name) {
    handleError('you can not omit site name')
  }
  console.log(name)
  const config = configure()
  const site = getValue(name, config.sites)
  let url = site.url
  let def = site.default || url
  if (args.length) {
    for (let i = 0; i < args.length; i++) {
      url = url.replace(' ', args[i])
    }
  } else {
    url = def || url
  }
  open(url)
}

/**
 * delete a site 
 * @param {array} args - site name
 * @param {object} opts - valid: -c, --children delete children, -f, --force, delete without prompt
 */
function rm(args, opts) {
  const name = args[0]
  if (!name) {
    prompt('are you sure to delete all sites!?(y/n)', function(yes) {
      if (yes) resetConfig()
      process.exit(0)
    })
    return
  }
  const config = configure(), delSub = opts.c || opts.children
  hasValue(name, config.sites)
  const del = function() {
    delValue(name, config.sites, delSub)
    configure(config)
    log('have delete ' + name, 'success')
  }
  if(opts.f || opts.force) {
    del()
  } else {
    prompt('are you sure to delete site: ' + name + '?(y/n)', function(yes) {
      if (yes) del()
      process.exit(0)
    })
  }
}

/**
 * print site info
 * @param {array} args - site name
 * @param {object} opts - valid: -t, --tree, print site info by tree
 */
function ls(args, opts) {
  const name = args[0]
  const config = configure()
  const obj = name ? getValue(name, config.sites) : config.sites
  if (opts.t || opts.tree) {
    tree(obj)
  } else {
    list(obj)
  }
}

module.exports = {
  add,
  rm,
  ls,
  visit,
}