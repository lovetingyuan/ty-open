const opn = require('opn');
const urlReg = require('url-regex');
const {
  handleError,
  log,
} = require('./utils');

function open(url) {
  log(`now, go to ${url}`, 'success');
  opn(url);
}

function hasProtocol(url) {
  return /^http(s)?:\/\//i.test(`${url}`);
}

function checkUrl(url = '', force) {
  const isValid = urlReg().test(encodeURI(url.replace(/ /g, 'me')));
  if (!isValid) {
    if (!force) {
      handleError(`your url: [${url}] seems to be invalid`);
    } else {
      log(`warning: your url: [${url}] seems to be invalid`, 'warning');
    }
  }
  return true;
}

module.exports = {
  open,
  hasProtocol,
  checkUrl,
};
