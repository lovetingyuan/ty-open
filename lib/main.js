var configit = require('./config')
var configure = configit.configure
var resetConfig = configit.resetConfig

var utils = require('./utils')
var handleError = utils.handleError
var onlyHas = utils.onlyHas
var prompt = utils.prompt

var urls = require('./urls')
var hasProtocol = urls.hasProtocol
var checkUrl = urls.checkUrl
var open = urls.open

var value = require('./value')
var getValue = value.getValue
var setValue = value.setValue
var delValue = value.delValue
var hasValue = value.hasValue

/**
 * to add a site 
 * options: -d(--default, add to default), 
 *  -s(--ssl, if omit protocal, add https://)
 * @param {array} args - the site name
 * @param {object} opts - the site address
 */
function add(args, opts) {
  var name = args[0], url = args[1]
  if (!name || !checkUrl(url)) {
    handleError('you can not add a site without "name" or "url"')
  }

  if(['ls', 'add', 'rm'].indexOf(name) !== -1) {
    handleError('sorry, you can not use "ls" or "add" or "rm" as a site name')
  }
  // if(!onlyHas(['d', 'default', 's', 'ssl'], opts)) {
  //   handleError('invalid options')
  // }
  var config = configure()
  if(!hasProtocol(url)) {
    if(opts.s || opts.ssl) {
      url = 'https://' + url
    } else {
      url = 'http://' + url
    }
  }
  setValue(name, config.sites, url, opts.d || opts.default)
  configure(config)
  console.log('have added the site ' + name)
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
  var noUrl = function() {
    handleError('you have not set a url for site ' + name + 
      ', use "to add '+ name +' the_url"')
  }
  var config = configure()
  var site = getValue(name, config.sites), url
  if(args.length) {
    url = site.url
    if(!url) {
      noUrl()
    }
    for(var i = 0; i < args.length; i++) {
      url = url.replace(' ', args[i])
    }
  } else {
    url = site.default || site.url
    if(!url) {
      noUrl()
    }
  }
  open(url)
}

/**
 * delete a site 
 * @param {array} args - site name
 * @param {object} opts - valid: -c, --children delete children, -f, --force, delete without prompt
 */
function rm(args, opts) {
  var name = args[0]
  if (!name) {
    prompt('are you sure to delete all sites!?(y/n)', function(yes) {
      if(yes) {
        resetConfig()
      }
      process.exit(0)
    })
    return
  }
  var config = configure(), delSub = opts.c || opts.children
  hasValue(name, config.sites)
  var del = function() {
    delValue(name, config.sites, delSub)
    configure(config)
    console.log('have delete ' + name)
  }
  if(opts.f || opts.force) {
    del()
  } else {
    prompt('are you sure to delete site: ' + name + '?(y/n)', function(yes) {
      if(yes) del()
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
  var name = args[0]
  var config = configure()
  if (!name) {
    console.log(JSON.stringify(config.sites, null, 2))
  } else {
    var site = getValue(name, config.sites)
    console.log(JSON.stringify(site, null, 2))
  }
}

module.exports = {
  add: add,
  rm: rm,
  ls: ls,
  visit: visit
}