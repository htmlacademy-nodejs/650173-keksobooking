'use strict';

const express = require(`express`);
const {offersRouter, offers} = require(`./offers/router`);

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};
const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

class Server {
  constructor(port = 3000) {
    this.app = express();
    this.port = parseInt(port, 10);

    this._setupServer();
  }

  start() {
    return new Promise(() => {
      this._executeServer();
    });
  }

  _setupServer() {
    this.app.use(express.static(`${__dirname}/../../static`));
    this.app.use(`/api/offers`, offersRouter);
    this.app.use(NOT_FOUND_HANDLER);
    this.app.use(ERROR_HANDLER);
  }

  _executeServer() {
    this.app.listen(this.port, () => console.log(`Server running at ${ this._serverAddress }`));
  }

  get _serverAddress() {
    return `http://localhost:${ this.port }/`;
  }
}

module.exports = {
  Server,
  offers
};
