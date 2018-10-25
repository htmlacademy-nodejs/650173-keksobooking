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


describe(`POST /api/offers`, () => {
  const validOfferAttributes = {
    title: `1`.repeat(30),
    type: `flat`,
    price: 100,
    address: `address`,
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

      const offer = response.body;
      assert(PreparedData.NAMES.includes(offer.name));
      delete offer.name;
      assert.deepStrictEqual(offer, validOfferAttributes);
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

      const offer = response.body;
      assert(PreparedData.NAMES.includes(offer.name));
      delete offer.name;
      assert.deepStrictEqual(offer, validOfferAttributes);
    });
  });
});
