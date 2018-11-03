'use strict';

const {MongoError} = require(`mongodb`);
const logger = require(`../../logger`);
const showDataByAcceptType = require(`../offers/show-data-by-accept-type`);

const ERROR_HANDLER = (err, req, res, _next) => {
  logger.error(err);

  if (err instanceof MongoError) {
    res.status(400);
  } else {
    res.status(err.code || 500);
  }

  const data = [
    {
      error: `Error`,
      errorMessage: err.message
    }
  ];

  showDataByAcceptType(req, res, data);
};

module.exports = ERROR_HANDLER;
