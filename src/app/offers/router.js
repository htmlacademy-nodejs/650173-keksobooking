'use strict';

const express = require(`express`);
const multer = require(`multer`);

const {OffersController, offers} = require(`./offers-controller`);

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const jsonParser = express.json();
const memoryStorage = multer({storage: multer.memoryStorage()});
const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const offerImages = memoryStorage.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]);

offersRouter
  .get(``, asyncMiddleware(OffersController.index))
  .get(`/:date`, asyncMiddleware(OffersController.show))
  .post(``, jsonParser, offerImages, asyncMiddleware(OffersController.create));

module.exports = {
  offersRouter,
  offers
};
