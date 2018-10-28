'use strict';

const {validationResult} = require(`express-validator/check`);
const toStream = require(`buffer-to-stream`);

const Utils = require(`../../utils`);
const {DefaultsPageSettings} = require(`../../constants`);
const {errorFormatter} = require(`./validation`);
const {NotFoundError} = require(`../errors/not-found-error`);

const getLocationFromAddress = (address) => {
  const [x, y] = address.replace(` `, ``).split(`,`);

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  };
};

const saveImages = async (insertedId, files) => {
  if (files) {
    if (files.avatar && files.avatar[0]) {
      await OffersController.avatarStore.save(insertedId, toStream(files.avatar[0].buffer));
    }

    if (files.preview && files.preview[0]) {
      await files.preview.forEach((preview, index) => {
        OffersController.previewStore.save(`${insertedId}-${index}`, toStream(preview.buffer));
      });
    }
  }
};

const findOffer = async (offerDate) => {
  const offer = await OffersController.store.getOffer(offerDate);

  if (!offer) {
    throw new NotFoundError(`Оффер с датой "${offerDate}" не найден`);
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

const prepareData = ({body, files}) => {
  const offer = Object.assign({}, body);
  const date = (new Date()).getTime();

  const location = getLocationFromAddress(offer.address);
  const author = {name: offer.name};
  delete offer.name;

  if (files) {
    if (files.avatar && files.avatar[0]) {
      author.avatar = `/api/offers/${date}/avatar`;
      delete offer.avatar;
    }

    if (files.preview) {
      offer.photos = files.preview.map((p, i) => `/api/offers/${date}/preview/${i}`);
      delete offer.preview;
    }
  }

  return {author, offer, location, date};
};

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
      const preparedData = prepareData(req);
      const result = await OffersController.store.save(preparedData);
      const insertedId = result.insertedId;

      saveImages(insertedId, req.files);

      res.send(req.body);
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

