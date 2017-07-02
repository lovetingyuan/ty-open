const chalk = require('chalk')
const emoji = require('node-emoji')
const webEmoji = emoji.get(':globe_with_meridians:')
const symbolEmoji = emoji.get(':symbols:')
const linkEmoji = emoji.get(':link:')

function printSpace(num = 0, content = '', char = '|---') {
  let place = ''
  let space = ''
  for (let i = 0; i < char.length; i++) {
    space += ' '
  }
  for (let i = 0; i < num - 1; i++) {
    place += space
  }
  place = place ? place + char : char
  console.log(num ? place + content : content)
}

function tree(obj, depth = 0) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    printSpace(depth, `${webEmoji}  ${chalk.bold.blue(key)}`)
    let site = obj[key]
    printSpace(depth + 1, `${linkEmoji}  ${chalk.green(site.url.replace(/ /g, symbolEmoji))}`)
    site.default !== site.url && printSpace(depth + 1, `${linkEmoji}  ${chalk.yellow(site.default)} (default)`)
    JSON.stringify(site.sub) !== '{}' && tree(site.sub, depth + 1)
  }
}

function flatValue(obj, pre, result = {}) {
  pre = pre ? pre + '.' : ''
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    if (typeof obj[key] === 'object') {
      flatValue(obj[key].sub, pre + key, result)
    } else {
      result[pre + key] = {
        url: obj[key].url,
        default: obj[key].default
      }
    }
  }
  return result
}

function list(obj) {
  const _obj = flatValue(obj)
  for (let key in _obj) {
    let { url, default:def } = _obj[key]
    let pre = ` ${linkEmoji}  ${chalk.bold.blue(key)}: `
    console.log(`${pre}${chalk.green(url.replace(/ /g, symbolEmoji))}`)
    if (url !== def) {
      let space = ''
      for (let i = 0; i < pre.length; i++) {
        space += ' '
      }
      console.log(`${space}${chalk.yellow(def)}`)
    }
  }
}

module.exports = {
  tree,
  list
}