'use strict';

const {Server} = require(`../app/server`);

module.exports = {
  name: `--server`,
  description: `Runs server. You can set the port number: --server 3000`,
  userCommand: true,
  execute() {
    return new Server(process.argv[3]).start();
  }
};
