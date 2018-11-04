'use strict';

const showDataByAcceptType = require(`../offers/show-data-by-accept-type`);

const VALID_METHODS = [`GET`, `POST`];

const NOT_IMPLEMENTED_HANDLER = (req, res, next) => {
  if (!VALID_METHODS.includes(req.method)) {
    res.status(501);
    const data = [
      {
        error: `Not Implemented Error`,
        errorMessage: `${req.method} is not implemented`
      }
    ];

    showDataByAcceptType(req, res, data);
  } else {
    next();
  }
};

module.exports = NOT_IMPLEMENTED_HANDLER;
