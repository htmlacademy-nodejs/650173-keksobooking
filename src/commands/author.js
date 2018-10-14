'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `--author`,
  description: `Shows application author`,
  userCommand: true,
  execute() {
    return Promise.resolve(console.log(`Author: ${ colors.red(packageInfo.author) }`));
  }
};
