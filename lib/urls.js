'use strict';

var opn = require('opn');
var urlReg = require('url-regex');

var _require = require('./utils'),
    handleError = _require.handleError,
    log = _require.log;

function open(url) {
  log('now, go to ' + url, 'success');
  opn(url);
}

function hasProtocol(url) {
  return (/^http(s)?:\/\//i.test('' + url)
  );
}

function checkUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var force = arguments[1];

  var isValid = urlReg().test(encodeURI(url.replace(/ /g, 'me')));
  if (!isValid) {
    if (!force) {
      handleError('your url: [' + url + '] seems to be invalid');
    } else {
      log('warning: your url: [' + url + '] seems to be invalid', 'warning');
    }
  }
}

module.exports = {
  open: open,
  hasProtocol: hasProtocol,
  checkUrl: checkUrl
};