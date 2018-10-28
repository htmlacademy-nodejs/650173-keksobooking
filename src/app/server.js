'use strict';

require('dotenv').config();

const express = require(`express`);
const {MongoError} = require(`mongodb`);

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};
const ERROR_HANDLER = (err, req, res, _next) => {
  console.error(err);

  if (err instanceof MongoError) {
    res.status(400).json(err.message);

    return;
  }

  res.status(err.code || 500).send(err.message);
};

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
      this.app.listen(this.port, SERVER_HOST, () => console.log(`Server running at ${ this._serverAddress }`));
    });
  }

  _setup() {
    this.app.use(express.static(`${__dirname}/../../static`));
    this.app.use(express.json());
    this.app.use(`/api/offers`, Server.router);
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
