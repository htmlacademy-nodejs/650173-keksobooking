'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  name: undefined,
  execute() {
    console.log(`Hey there!\nThis app will execute the server for «${ packageInfo.name }».\nAuthor: ${ packageInfo.author }`);
  }
};
