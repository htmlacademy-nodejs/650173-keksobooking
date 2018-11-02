'use strict';

const VALID_METHODS = [`GET`, `POST`];

const NOT_IMPLEMENTED_HANDLER = (req, res, next) => {
  if (!VALID_METHODS.includes(req.method)) {
    res.status(501).send([
      {
        error: `Not Implemented Error`,
        errorMessage: `${req.method} is not implemented`
      }
    ]);
  } else {
    next();
  }
};

module.exports = NOT_IMPLEMENTED_HANDLER;
