'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var chalk = require('chalk');
var emoji = require('node-emoji');

var webEmoji = emoji.get(':globe_with_meridians:') + '  ';
var symbolEmoji = emoji.get(':symbols:') + '  ';
var linkEmoji = emoji.get(':link:') + '  ';

function printSpace() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '|---';

  var place = '';
  var space = '';
  for (var i = 0; i < char.length; i++) {
    space += ' ';
  }
  for (var _i = 0; _i < num - 1; _i++) {
    place += space;
  }
  place = place ? place + char : char;
  console.log(num ? place + content : content); // eslint-disable-line no-console
}

function tree(obj) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  Object.keys(obj).forEach(function (key) {
    printSpace(depth, '' + webEmoji + chalk.bold.blue(key));
    var site = obj[key];
    if (site.url) {
      printSpace(depth + 1, '' + linkEmoji + chalk.green(site.url.replace(/ /g, symbolEmoji)));
      if (site.default !== site.url) {
        printSpace(depth + 1, '' + linkEmoji + chalk.yellow(site.default) + ' (default)');
      }
    }
    if (JSON.stringify(site.sub) !== '{}') tree(site.sub, depth + 1);
  });
}

function flatValue(obj, pre) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var prefix = pre ? pre + '.' : '';
  Object.keys(obj).forEach(function (key) {
    if (obj[key].url) {
      result[prefix + key] = { // eslint-disable-line no-param-reassign
        url: obj[key].url,
        default: obj[key].default
      };
    }
    if (_typeof(obj[key].sub) === 'object') {
      flatValue(obj[key].sub, prefix + key, result);
    }
  });
  return result;
}

function list(obj) {
  var value = flatValue(obj);
  Object.keys(value).forEach(function (key) {
    var _value$key = value[key],
        url = _value$key.url,
        def = _value$key.default;

    var pre = '' + webEmoji + chalk.bold.blue(key) + ': ';
    if (url) {
      // eslint-disable-next-line no-console
      console.log('' + pre + chalk.green(url.replace(/ /g, symbolEmoji)));
      if (url !== def) {
        var space = Array.apply(undefined, _toConsumableArray({ length: key.length + 6 })).join(' ');
        console.log('' + space + chalk.yellow(def)); // eslint-disable-line no-console
      }
    }
  });
}

module.exports = {
  tree: tree,
  list: list
};