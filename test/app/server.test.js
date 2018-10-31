'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const {PreparedData} = require(`../../src/data/data`);
const offersStoreMock = require(`../mock/offers-store-mock`);
const imagesStoreMock = require(`../mock/images-store-mock`);
const offersController = require(`../../src/app/offers/offers-controller`)(offersStoreMock, imagesStoreMock, imagesStoreMock);
const offersRouter = require(`../../src/app/offers/router`)(offersController);
const Server = require(`../../src/app/server`)(offersRouter);
const app = new Server().app;


describe(`DELETE /api/offers`, () => {
  it(`returns NOT IMPLEMENTED ERROR(501)`, async () => {
    await request(app).
      del(`/api/offers`).
      expect(501).
      expect(`Content-Type`, /html/);
  });
});

describe(`GET /api/offers`, () => {
  it(`returns all offers`, async () => {
    const response = await request(app).
      get(`/api/offers`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const requestedOffers = response.body;
    assert.deepStrictEqual(requestedOffers, {
      data: offersStoreMock.offers,
      total: offersStoreMock.offers.length,
      skip: 0,
      limit: 20
    });
  });

  context(`when limit and skip are present`, () => {
    it(`returns part of offers`, async () => {
      const skip = 2;
      const limit = 3;

      const response = await request(app).
        get(`/api/offers?skip=${skip}&limit=${limit}`).
        set(`Accept`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const requestedOffers = response.body;
      const partOfOffers = offersStoreMock.offers.slice(skip).slice(0, limit);
      assert.deepStrictEqual(requestedOffers, {
        data: partOfOffers,
        skip,
        limit,
        total: offersStoreMock.offers.length
      });
    });
  });

  context(`when we request unknown resource`, () => {
    it(`returns 404`, async () => {
      return await request(app).
        get(`/api/unknown_resource`).
        set(`Accept`, `application/json`).
        expect(404).
        expect(`Page was not found`).
        expect(`Content-Type`, /html/);
    });
  });
});

describe(`GET /api/offers/:date`, () => {
  context(`when offer exists`, () => {
    it(`returns correct offer`, async () => {
      const offerDate = offersStoreMock.offers[0].date;

      const response = await request(app).
        get(`/api/offers/${offerDate}`).
        set(`Accept`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const requestedOffer = response.body;
      assert.strictEqual(requestedOffer.date, offerDate);
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      return request(app).
        get(`/api/offers/${offerDate}`).
        set(`Accept`, `application/json`).
        expect(404).
        expect(`Оффер с датой "${offerDate}" не найден`).
        expect(`Content-Type`, /html/);
    });
  });
});

describe(`GET /api/offers/:date/avatar`, () => {
  context(`when offer exists`, () => {
    const offerWithAvatar = offersStoreMock.offers.find((offer) => offer._id === 1);
    const offerDate = offerWithAvatar.date;

    it(`returns correct offer's avatar`, async () => {
      return await request(app).
        get(`/api/offers/${offerDate}/avatar`).
        set(`Accept`, `image/jpeg`).
        expect(200).
        expect(`Content-Type`, `image/jpeg`);
    });
  });

  context(`when avatar for offer does not exist`, () => {
    const offerWithoutAvatar = offersStoreMock.offers.find((offer) => offer._id === 2);
    const offerDate = offerWithoutAvatar.date;

    it(`returns 404`, async () => {
      return await request(app).
        get(`/api/offers/${offerDate}/avatar`).
        set(`Accept`, `application/json`).
        expect(404).
        expect(`Аватар для оффера с датой "${offerDate}" не найден`).
        expect(`Content-Type`, /html/);
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      return await request(app).
        get(`/api/offers/${offerDate}/avatar`).
        set(`Accept`, `application/json`).
        expect(400).
        expect(`Оффер с датой "${offerDate}" не найден`).
        expect(`Content-Type`, /html/);
    });
  });
});

describe(`GET /api/offers/:date/preview/:id`, () => {
  context(`when offer exists`, () => {
    const offerWithPreview = offersStoreMock.offers.find((offer) => offer._id === 1);
    const offerDate = offerWithPreview.date;

    it(`returns correct offer's avatar`, async () => {
      return await request(app).
        get(`/api/offers/${offerDate}/preview/1`).
        set(`Accept`, `image/jpeg`).
        expect(200).
        expect(`Content-Type`, `image/jpeg`);
    });
  });

  context(`when preview for offer does not exist`, () => {
    const offerWithoutPreview = offersStoreMock.offers.find((offer) => offer._id === 2);
    const offerDate = offerWithoutPreview.date;

    it(`returns 404`, async () => {
      return await request(app).
        get(`/api/offers/${offerDate}/preview/2`).
        set(`Accept`, `application/json`).
        expect(404).
        expect(`Фото для оффера с датой "${offerDate}" не найдено`).
        expect(`Content-Type`, /html/);
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      return await request(app).
        get(`/api/offers/${offerDate}/preview/0`).
        set(`Accept`, `application/json`).
        expect(400).
        expect(`Оффер с датой "${offerDate}" не найден`).
        expect(`Content-Type`, /html/);
    });
  });
});

describe(`POST /api/offers`, () => {
  const validOfferAttributes = {
    title: `1`.repeat(30),
    type: `palace`,
    price: 100,
    address: `350, 450`,
    checkin: `10:15`,
    checkout: `10:15`,
    rooms: 2,
    features: [`wifi`, `dishwasher`]
  };

  const validationError = (key) => {
    return {error: `Validation Error`, fieldName: key, errorMessage: `Invalid value`};
  };

  const validationErrors = Object.keys(validOfferAttributes).map((key) => validationError(key));

  context(`when data is invalid and content type is json`, () => {
    it(`returns array of errors`, async () => {
      const response = await request(app).
        post(`/api/offers`).
        send({features: [`test`]}).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `application/json`).
        expect(400).
        expect(`Content-Type`, /json/);

      const offer = response.body;
      assert.deepStrictEqual(offer, validationErrors);
    });
  });

  context(`when data is invalid and content type is multipart/form-data`, () => {
    const filesValidationErrors = [`avatar`, `preview`].map((key) => validationError(key));
    const validationErrorsWithFiles = validationErrors.concat(filesValidationErrors);

    it(`returns array of errors`, async () => {
      const response = await request(app).
        post(`/api/offers`).
        field(`features`, [`test`]).
        attach(`avatar`, `test/fixtures/file.txt`).
        attach(`preview`, `test/fixtures/file.txt`).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `multipart/form-data`).
        expect(400).
        expect(`Content-Type`, /json/);

      const offer = response.body;
      assert.deepStrictEqual(offer, validationErrorsWithFiles);
    });
  });

  context(`when content type is json`, () => {
    it(`returns offer`, async () => {
      const response = await request(app).
        post(`/api/offers`).
        send(validOfferAttributes).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const result = response.body;
      assert(PreparedData.NAMES.includes(result.author.name));
      assert.deepStrictEqual(result.offer.photos, []);
      delete result.offer.photos;
      assert.deepStrictEqual(result.offer, validOfferAttributes);
    });
  });

  context(`when content type is json and features and preview are empty`, () => {
    it(`returns offer`, async () => {
      const offerAttributes = Object.assign({}, validOfferAttributes);
      delete offerAttributes.preview;
      delete offerAttributes.features;

      const response = await request(app).
        post(`/api/offers`).
        send(offerAttributes).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const result = response.body;
      assert(PreparedData.NAMES.includes(result.author.name));
      assert.deepStrictEqual(result.offer.photos, []);
      assert.deepStrictEqual(result.offer.features, []);
      delete result.offer.photos;
      delete result.offer.features;
      assert.deepStrictEqual(result.offer, offerAttributes);
    });
  });

  context(`when content type is multipart/form-data`, () => {
    it(`returns offer`, async () => {
      const response = await request(app).
        post(`/api/offers`).
        field(`title`, validOfferAttributes.title).
        field(`type`, validOfferAttributes.type).
        field(`price`, validOfferAttributes.price).
        field(`address`, validOfferAttributes.address).
        field(`checkin`, validOfferAttributes.checkin).
        field(`checkout`, validOfferAttributes.checkout).
        field(`rooms`, validOfferAttributes.rooms).
        field(`features`, validOfferAttributes.features).
        attach(`avatar`, `test/fixtures/keks.png`).
        attach(`preview`, `test/fixtures/keks.png`).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `multipart/form-data`).
        expect(200).
        expect(`Content-Type`, /json/);

      const result = response.body;
      delete result.offer.photos;
      assert(PreparedData.NAMES.includes(result.author.name));
      assert.deepStrictEqual(result.offer, validOfferAttributes);
    });
  });
});
