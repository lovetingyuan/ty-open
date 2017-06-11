var opn = require('opn')
var urlReg = require('url-regex')

function open(url) {
  console.log('now, go to ' + url)
  opn(url)
}

function hasProtocol(url) {
  return /^http(s)?:\/\//i.test(url);
}

function checkUrl(url) {
  // TODO
  if(typeof url !== 'string' || url.indexOf('.') === -1 || url.length < 4) {
    console.log('the url:' + url + ' is invalid')
    return false
  }
  if(!hasProtocol(url)) {
    url = 'http://' + url
  }
  var isValid = urlReg({exact: true}).test(encodeURI(url.replace(/ /g, 'me')))
  if (!isValid) console.log('warning: your url seems to be invalid')
  return true
}

module.exports = {
  open: open,
  hasProtocol: hasProtocol,
  checkUrl: checkUrl
}