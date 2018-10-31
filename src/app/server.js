'use strict';

const express = require(`express`);
const logger = require(`../logger`);
const {NOT_FOUND_HANDLER} = require(`./errors/not-found-error`);
const ERROR_HANDLER = require(`./errors/errors-handler`);
const NOT_IMPLEMENTED_HANDLER = require(`./errors/not-implemented-handler`);
const ALLOW_CORS = require(`./allow-cors.js`);

const {
  SERVER_PORT = 3000,
  SERVER_HOST = `localhost`
} = process.env;

class Server {
  constructor(port = SERVER_PORT) {
    this.app = express();
    this.port = parseInt(port, 10);

    this._setup();
  }

  start() {
    return new Promise(() => {
      this.app.listen(this.port, SERVER_HOST, () => logger.info(`Server running at ${ this._serverAddress }`));
    });
  }

  _setup() {
    this.app.use(NOT_IMPLEMENTED_HANDLER);
    this.app.use(express.static(`${__dirname}/../../static`));
    this.app.use(express.json());
    this.app.use(`/api/offers`, Server.router);
    this.app.use(ALLOW_CORS);
    this.app.use(NOT_FOUND_HANDLER);
    this.app.use(ERROR_HANDLER);
  }

  get _serverAddress() {
    return `http://${ SERVER_HOST }:${ this.port }/`;
  }
}

module.exports = (router) => {
  Server.router = router;

  return Server;
};
