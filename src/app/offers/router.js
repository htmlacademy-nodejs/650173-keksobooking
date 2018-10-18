'use strict';

const express = require(`express`);
const multer = require(`multer`);
const {checkSchema} = require(`express-validator/check`);

const {OffersController, offers} = require(`./offers-controller`);
const {schema} = require(`./validation`);

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const memoryStorage = multer({storage: multer.memoryStorage()});
const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const offerImages = memoryStorage.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]);

offersRouter
  .get(``, asyncMiddleware(OffersController.index))
  .get(`/:date`, asyncMiddleware(OffersController.show))
  .post(``, offerImages, checkSchema(schema), asyncMiddleware(OffersController.create));

module.exports = {
  offersRouter,
  offers
};
