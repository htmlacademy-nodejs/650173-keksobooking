'use strict';

const {validationResult} = require(`express-validator/check`);
const toStream = require(`buffer-to-stream`);

const Utils = require(`../../utils`);
const {DefaultsPageSettings} = require(`../../constants`);
const {errorFormatter} = require(`./validation`);
const NotFoundError = require(`../errors/not-found-error`);

class OffersController {
  static async index(req, res) {
    const skip = parseInt(req.query.skip || DefaultsPageSettings.SKIP, 10);
    const limit = parseInt(req.query.limit || DefaultsPageSettings.LIMIT, 10);

    const offers = (await Utils.toPage(await OffersController.store.getAllOffers(), skip, limit));
    res.send(offers);
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

        if (req.files.preview && req.files.preview[0]) {
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

    res.header(`Content-Type`, avatar.info.contentType);
    res.header(`Content-Length`, avatar.info.length);

    res.on(`error`, (error) => console.error(error));
    res.on(`end`, () => res.end());

    const stream = avatar.stream;
    stream.on(`error`, (error) => console.error(error));
    stream.on(`end`, () => res.end());
    stream.pipe(res);
  }
}

module.exports = (store, avatarStore, previewStore) => {
  OffersController.store = store;
  OffersController.avatarStore = avatarStore;
  OffersController.previewStore = previewStore;

  return OffersController;
};

