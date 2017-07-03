const chalk = require('chalk');
const emoji = require('node-emoji');

const webEmoji = emoji.get(':globe_with_meridians:');
const symbolEmoji = emoji.get(':symbols:');
const linkEmoji = emoji.get(':link:');

function printSpace(num = 0, content = '', char = '|---') {
  let place = '';
  let space = '';
  for (let i = 0; i < char.length; i++) {
    space += ' ';
  }
  for (let i = 0; i < num - 1; i++) {
    place += space;
  }
  place = place ? place + char : char;
  console.log(num ? place + content : content); // eslint-disable-line no-console
}

function tree(obj, depth = 0) {
  Object.keys(obj).forEach((key) => {
    printSpace(depth, `${webEmoji}  ${chalk.bold.blue(key)}`);
    const site = obj[key];
    printSpace(depth + 1, `${linkEmoji}  ${chalk.green(site.url.replace(/ /g, symbolEmoji))}`);
    if (site.default !== site.url) {
      printSpace(depth + 1, `${linkEmoji}  ${chalk.yellow(site.default)} (default)`);
    }
    if (JSON.stringify(site.sub) !== '{}') tree(site.sub, depth + 1);
  });
}

function flatValue(obj, pre, result = {}) {
  const prefix = pre ? `${pre}.` : '';
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key].sub === 'object') {
      flatValue(obj[key].sub, prefix + key, result);
    } else {
      result[prefix + key] = { // eslint-disable-line no-param-reassign
        url: obj[key].url,
        default: obj[key].default,
      };
    }
  });
  return result;
}

function list(obj) {
  const value = flatValue(obj);
  Object.keys(value).forEach((key) => {
    const { url, default: def } = value[key];
    const pre = ` ${linkEmoji}  ${chalk.bold.blue(key)}: `;
    // eslint-disable-next-line no-console
    console.log(`${pre}${chalk.green(url.replace(/ /g, symbolEmoji))}`);
    if (url !== def) {
      const space = Array.call(null, { length: pre.length - 1 }).map(() => ' ').join('');
      console.log(`${space}${chalk.yellow(def)}`); // eslint-disable-line no-console
    }
  });
}

module.exports = {
  tree,
  list,
};
