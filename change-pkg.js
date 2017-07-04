#! /usr/bin/env node

var fs = require('fs');

try {
  var pkg = require('./package.json');
  var keyPath = process.argv[2];
  var value = process.argv[3];
  if (!keyPath || !value) {
    console.log('you must specify key and value to be updated');
    process.exit(-1);
  }
  var keyList = keyPath.split('.'), key, val = pkg;
  for (var i = 0; i < keyList.length; i++) {
    key = keyList[i];
    if (i === keyList.length - 1) {
      try {
        val[key] = eval('(' + value + ')');
      } catch (e) {
        console.log('warning: fail to change value to JSON')
        val[key] = value;
      }
    } else {
      if (!(key in val)) {
        val = val[key] = {};
      } else {
        val = val[key];
      }
    }
  }
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
  console.log('package.json has been updated');
} catch(e) {
  console.log('Error: failed to update package.json', e);
  process.exit(-1);
}
