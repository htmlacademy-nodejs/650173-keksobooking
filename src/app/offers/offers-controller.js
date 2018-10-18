'use strict';

const {validationResult} = require(`express-validator/check`);

const {Data} = require(`../../data`);
const {errorFormatter} = require(`./validation`);
const NotFoundError = require(`../errors/not-found-error`);

const OFFERS = Array(10).fill(null).map(() => Data.generate());
const Defaults = {
  SKIP: 0,
  LIMIT: 20
};

class OffersController {
  static async index(req, res) {
    const skip = parseInt(req.query.skip || Defaults.SKIP, 10);
    const limit = parseInt(req.query.limit || Defaults.LIMIT, 10);

    const offers = OFFERS.slice(skip).slice(0, limit);
    const response = {
      data: offers,
      skip,
      limit,
      total: offers.length
    };

    res.send(response);
  }

  static async show(req, res) {
    const offerDate = parseInt(req.params.date, 10);
    const offer = OFFERS.find((it) => it.date === offerDate);

    if (!offer) {
      throw new NotFoundError(`Оффер с датой "${offerDate}" не найден`);
    }

    res.send(offer);
  }

  static async create(req, res) {
    const result = validationResult(req).formatWith(errorFormatter);

    if (!result.isEmpty()) {
      res.status(400).json(result.array());
    } else {
      res.send(req.body);
    }
  }
}

module.exports = {
  OffersController,
  offers: OFFERS
};
