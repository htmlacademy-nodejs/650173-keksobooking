'use strict';

// eslint-disable-next-line new-cap
const offersRouter = require(`express`).Router();
const {OffersController, offers} = require(`./offers-controller`);

offersRouter
  .get(``, OffersController.index)
  .get(`/:date`, OffersController.show);

module.exports = {
  offersRouter,
  offers
};
