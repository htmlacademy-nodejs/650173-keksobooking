'use strict';

const {validationResult} = require(`express-validator/check`);
const toStream = require(`buffer-to-stream`);

const {DefaultsPageSettings} = require(`../../constants`);
const {errorFormatter} = require(`./validation`);
const NotFoundError = require(`../errors/not-found-error`);

class OffersController {
  static async index(req, res) {
    const skip = parseInt(req.query.skip || DefaultsPageSettings.SKIP, 10);
    const limit = parseInt(req.query.limit || DefaultsPageSettings.LIMIT, 10);

    const offers = OffersController.store.getAllOffers(skip, limit);
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
    const offer = await OffersController.store.getOffer(offerDate);

    if (!offer) {
      throw new NotFoundError(`Оффер с датой "${offerDate}" не найден`);
    }

    res.send(offer);
  }

  static async create(req, res) {
    const validationCheckResult = validationResult(req).formatWith(errorFormatter);

    if (!validationCheckResult.isEmpty()) {
      res.status(400).json(validationCheckResult.array());
    } else {
      const result = await OffersController.store.save(req.body);
      const insertedId = result.insertedId;

      if (req.files) {
        if (req.files.avatar && req.files.avatar[0]) {
          await OffersController.avatarStore.save(insertedId, toStream(req.files.avatar[0].buffer));
        }

        if (req.files.avatar && req.files.preview[0]) {
          await OffersController.previewStore.save(insertedId, toStream(req.files.preview[0].buffer));
        }
      }

      res.send(req.body);
    }
  }

  static async avatar(req, res) {
    const offerDate = parseInt(req.params.date, 10);
    const offer = await OffersController.store.getOffer(offerDate);

    if (!offer) {
      throw new NotFoundError(`Оффер с датой "${offerDate}" не найден`);
    }

    const avatar = await OffersController.avatarStore.get(offer._id);

    if (!avatar) {
      throw new NotFoundError(`Аватар для оффера с датой "${offerDate}" не найден`);
    }

    res.header(`Content-Type`, `image/jpg`);
    res.header(`Content-Length`, avatar.info.length);

    res.on(`error`, (e) => console.error(e));
    res.on(`end`, () => res.end());
    const stream = avatar.stream;
    stream.on(`error`, (e) => console.error(e));
    stream.on(`end`, () => res.end());
    stream.pipe(res);
  }
}

module.exports = OffersController;
