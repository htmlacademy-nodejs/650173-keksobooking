'use strict';

const express = require(`express`);
const multer = require(`multer`);
const {checkSchema} = require(`express-validator/check`);

const OffersController = require(`./offers-controller`);
const {schema, prepareInputData} = require(`./validation`);

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const memoryStorage = multer({storage: multer.memoryStorage()});
const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const offerImages = memoryStorage.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]);
OffersController.store = offersRouter.store;

offersRouter
  .get(``, asyncMiddleware(OffersController.index))
  .get(`/:date`, asyncMiddleware(OffersController.show))
  .post(``,
      offerImages,
      prepareInputData,
      checkSchema(schema),
      asyncMiddleware(OffersController.create)
  );

module.exports = offersRouter;
