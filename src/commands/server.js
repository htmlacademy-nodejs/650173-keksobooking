'use strict';

const ImageStore = require(`../app/images/store`);
const offersStore = require(`../app/offers/store`);
const offersController = require(`../../src/app/offers/offers-controller`)(
    offersStore, new ImageStore(`avatars`), new ImageStore(`previews`)
);
const offersRouter = require(`../../src/app/offers/router`)(offersController);
const Server = require(`../../src/app/server`)(offersRouter);

module.exports = {
  name: `--server`,
  description: `Runs server. You can set the port number: --server 3000`,
  userCommand: true,
  execute() {
    return new Server(process.argv[3]).start();
  }
};
