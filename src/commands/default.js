'use strict';

const packageInfo = require(`../../package.json`);
const GenerateData = require(`../generate.js`);

module.exports = {
  name: undefined,
  needToExit: false,
  execute() {
    console.log(`Hey there!\nThis app will execute the server for «${ packageInfo.name }».\nAuthor: ${ packageInfo.author }\n`);

    const generateData = new GenerateData();
    generateData.start();
  }
};
