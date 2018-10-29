'use strict';

const express = require(`express`);
const multer = require(`multer`);
const {checkSchema} = require(`express-validator/check`);

const {schema, prepareInputData} = require(`./validation`);

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const memoryStorage = multer({storage: multer.memoryStorage()});
const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const offerImages = memoryStorage.fields([{name: `avatar`, maxCount: 1}, {name: `preview`}]);

const router = (controller) => {
  return offersRouter.
    get(``, asyncMiddleware(controller.index)).
    get(`/:date`, asyncMiddleware(controller.show)).
    get(`/:date/avatar`, asyncMiddleware(controller.avatar)).
    get(`/:date/preview/:id`, asyncMiddleware(controller.preview)).
    post(``,
        offerImages,
        prepareInputData,
        checkSchema(schema),
        asyncMiddleware(controller.create)
    );
};

module.exports = (controller) => {
  return router(controller);
};
