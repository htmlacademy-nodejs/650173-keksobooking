'use strict';

const VALID_METHODS = [`GET`, `POST`];

const NOT_IMPLEMENTED_HANDLER = (req, res, next) => {
  if (!VALID_METHODS.includes(req.method)) {
    res.status(501).send(`Method is not implemented`);
  } else {
    next();
  }
};

module.exports = NOT_IMPLEMENTED_HANDLER;
