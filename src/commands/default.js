'use strict';

const packageInfo = require(`../../package.json`);
const GenerateData = require(`../generate.js`);

module.exports = {
  name: undefined,
  execute() {
    console.log(`Hey there!\nThis app will execute the server for «${ packageInfo.name }».\nAuthor: ${ packageInfo.author }\n`);

    return new GenerateData().start();
  }
};
