'use strict';

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

module.exports = {
  NOT_FOUND_HANDLER,
  NotFoundError
};
