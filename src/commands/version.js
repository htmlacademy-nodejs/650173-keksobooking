'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `--version`,
  description: `Shows program version`,
  userCommand: true,
  execute() {
    return new Promise((resolve) => {
      const [major, minor, patch] = packageInfo.version.split(`.`);

      console.log(`v${ colors.red(major) }.${ colors.green(minor) }.${ colors.blue(patch) }`);
      resolve();
    });
  }
};
