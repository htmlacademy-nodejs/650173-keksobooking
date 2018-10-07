'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `--author`,
  description: `Shows application author`,
  execute() {
    return new Promise((resolve) => {
      console.log(`Author: ${ colors.red(packageInfo.author) }`);
      resolve();
    });
  }
};
