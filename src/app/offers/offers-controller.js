'use strict';

const {validationResult} = require(`express-validator/check`);
const toStream = require(`buffer-to-stream`);

const Utils = require(`../../utils`);
const {DefaultsPageSettings} = require(`../../constants`);
const {errorFormatter} = require(`./validation`);
const {NotFoundError} = require(`../errors/not-found-error`);
const BadRequestError = require(`../errors/bad-request-error`);
const prepareData = require(`./prepare-data`);
const showDataByAcceptType = require(`./show-data-by-accept-type`);

const saveImages = async (insertedId, files) => {
  if (files) {
    if (files.avatar && files.avatar[0]) {
      await OffersController.avatarStore.save(
          insertedId, toStream(files.avatar[0].buffer), files.avatar[0].mimetype
      );
    }

    if (files.preview) {
      await files.preview.forEach((preview, index) => {
        OffersController.previewStore.save(
            `${insertedId}-${index}`, toStream(preview.buffer), preview.mimetype
        );
      });
    }
  }
};

const findOffer = async (offerDate) => {
  const offer = await OffersController.store.getOffer(offerDate);

  if (!offer) {
    throw new BadRequestError(`Оффер с датой "${offerDate}" не найден`);
  }

  return offer;
};

const renderImage = (image, offerDate, res) => {
  res.header(`Content-Type`, image.info.contentType);
  res.header(`Content-Length`, image.info.length);

  res.on(`error`, (error) => console.error(error));
  res.on(`end`, () => res.end());

  const stream = image.stream;
  stream.on(`error`, (error) => console.error(error));
  stream.on(`end`, () => res.end());

  return stream.pipe(res);
};

const isNotNumber = (param) => param && isNaN(parseInt(param, 10));

class OffersController {
  static async index(req, res) {
    let skip;
    let limit;

    if (isNotNumber(req.query.skip) || isNotNumber(req.query.limit)) {
      throw new BadRequestError(`Params skip or limit are not correct`);
    } else {
      skip = parseInt(req.query.skip || DefaultsPageSettings.SKIP, 10);
      limit = parseInt(req.query.limit || DefaultsPageSettings.LIMIT, 10);
    }

    const offers = (await Utils.toPage(await OffersController.store.getAllOffers(), skip, limit));
    showDataByAcceptType(req, res, offers);
  }

  static async show(req, res) {
    const offerDate = parseInt(req.params.date, 10);
    const offer = await OffersController.store.getOffer(offerDate);

    if (!offer) {
      throw new NotFoundError(`Оффер с датой "${offerDate}" не найден`);
    }

    showDataByAcceptType(req, res, offer);
  }

  static async create(req, res) {
    const validationCheckResult = validationResult(req).formatWith(errorFormatter);

    if (!validationCheckResult.isEmpty()) {
      res.status(400);
      showDataByAcceptType(req, res, validationCheckResult.array());
    } else {
      const preparedData = prepareData(req);
      const result = await OffersController.store.save(preparedData);
      const insertedId = result.insertedId;

      saveImages(insertedId, req.files);

      res.send(preparedData);
    }
  }

  static async avatar(req, res) {
    const offerDate = parseInt(req.params.date, 10);
    const offer = await findOffer(offerDate);
    const avatar = await OffersController.avatarStore.get(offer._id);

    if (!avatar) {
      throw new NotFoundError(`Аватар для оффера с датой "${offerDate}" не найден`);
    }

    renderImage(avatar, offerDate, res);
  }

  static async preview(req, res) {
    const offerDate = parseInt(req.params.date, 10);
    const previewId = parseInt(req.params.id, 10);
    const offer = await findOffer(offerDate);
    const preview = await OffersController.previewStore.get(`${offer._id}-${previewId}`);

    if (!preview) {
      throw new NotFoundError(`Фото для оффера с датой "${offerDate}" не найдено`);
    }

    renderImage(preview, offerDate, res);
  }
}

module.exports = (store, avatarStore, previewStore) => {
  OffersController.store = store;
  OffersController.avatarStore = avatarStore;
  OffersController.previewStore = previewStore;

  return OffersController;
};

