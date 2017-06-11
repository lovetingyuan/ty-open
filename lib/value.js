/**
 * value module, to handle object by given path string
 * @module lib/value
 * @type {object}
 */

var handleError = require('./utils').handleError

function hasValue(path, obj) {
  var keyList = path.split('.')
  var result = obj, key
  for(var i = 0; i < keyList.length; i++) {
    key = keyList[i]
    if(!result[key]) {
      handleError('no such site, please check the name ' + path)
    }
    result = result[key].sub
  }
}

/**
 * get value from an object by the given path
 * @param {string} path string
 * @param {object} obj object
 * @return {object}
 */
function getValue (path, obj) {
  hasValue(path, obj)
  var keyList = path.split('.')
  var result = obj, key
  for(var i = 0; i < keyList.length; i++) {
    key = keyList[i]
    if(i === keyList.length - 1) {
      result = result[key]
    } else {
      result = result[key].sub
    }
  }
  return result
}
/**
 * delete value from an Object
 * @param {string} path 
 * @param {object} obj 
 * @param {string} type - enum: 'all', 'sub', 'self'
 */
function delValue(path, obj, deleteSub) {
  hasValue(path, obj)
  var keyList = path.split('.')
  var result = obj, key
  for(var i = 0; i < keyList.length; i++) {
    key = keyList[i]
    if (i === keyList.length - 1) {
      if(deleteSub) {
        result[key].sub = {}
      } else {
        delete result[key]
      }
    } else {
      result = result[key].sub
    }
  }
}

function flatValue(obj, pre, result) {
  result = result || {}
  pre = pre ? pre + '.' : ''
  for(var key in obj) {
    if(!obj.hasOwnProperty(key)) continue
    if(typeof obj[key] === 'object') {
      flatValue(obj[key], pre + key, result)
    } else {
      result[pre + key] = obj[key]
    }
  }
  return result
}

/**
 * add or update a site url 
 * @param {string} path - key list
 * @param {object} obj - object to handle
 * @param {string} value - site url to set
 * @param {boolean} isDefault - to set default value or not
 */
function setValue(path, obj, value, isDefault) {
  var keyList = path.split('.')
  var result = obj, key
  for (var i = 0; i < keyList.length; i++) {
    key = keyList[i]
    if (!result[key]) {
      result[key] = {
        sub: {}
      }
    } 
    if(!result[key].sub) {
      result[key].sub = {}
    }
    if (i === keyList.length - 1) {
      if(isDefault) {
        result[key].default = value
        if(!result[key].url) result[key].url = value
      } else {
        result[key].url = value
        if(!result[key].default) result[key].default = value
      }
    } else {
      result = result[key].sub
    }
  }
}

module.exports = {
  delValue: delValue,
  hasValue: hasValue,
  setValue: setValue,
  getValue: getValue
}