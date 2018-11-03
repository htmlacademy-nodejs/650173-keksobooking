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
    const response = await request(app).
      del(`/api/offers`).
      expect(501).
      expect(`Content-Type`, /json/);

    assert.deepStrictEqual(response.body, [
      {
        error: `Not Implemented Error`,
        errorMessage: `DELETE is not implemented`
      }
    ]);
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

  context(`when accept is text/html`, () => {
    it(`returns all offers`, async () => {
      const response = await request(app).
        get(`/api/offers`).
        set(`Accept`, `text/html`).
        expect(200).
        expect(`Content-Type`, /html/);

      const requestedOffers = response.text;
      assert.deepStrictEqual(requestedOffers, JSON.stringify({
        data: offersStoreMock.offers,
        skip: 0,
        limit: 20,
        total: offersStoreMock.offers.length
      }));
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

    it(`returns 400 when skip or limit are not correct`, async () => {
      const skip = `str`;
      const limit = `str2`;

      const response = await request(app).
        get(`/api/offers?skip=${skip}&limit=${limit}`).
        set(`Accept`, `text/html`).
        expect(400).
        expect(`Content-Type`, /html/);

      const error = JSON.parse(response.text);
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Params skip or limit are not correct`
        }
      ]);
    });
  });

  context(`when we request unknown resource`, () => {
    it(`returns 404`, async () => {
      return await request(app).
        get(`/api/unknown_resource`).
        set(`Accept`, `text/html`).
        expect(404).
        expect(`Page was not found`).
        expect(`Content-Type`, /html/);
    });
  });
});

describe(`GET /api/offers/:date`, () => {
  context(`when offer exists`, () => {
    it(`returns correct offer`, async () => {
      const offer = offersStoreMock.offers[0];
      const offerDate = offer.date;

      const response = await request(app).
        get(`/api/offers/${offerDate}`).
        set(`Accept`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const requestedOffer = response.body;
      assert.deepStrictEqual(requestedOffer, offer);
    });
  });

  context(`when offer exists and accept is text/html`, () => {
    it(`returns correct offer`, async () => {
      const offer = offersStoreMock.offers[0];
      const offerDate = offer.date;

      const response = await request(app).
        get(`/api/offers/${offerDate}`).
        set(`Accept`, `text/html`).
        expect(200).
        expect(`Content-Type`, /html/);

      const requestedOffer = response.text;
      assert.deepStrictEqual(requestedOffer, JSON.stringify(offer));
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      const response = await request(app).
        get(`/api/offers/${offerDate}`).
        set(`Accept`, `text/html`).
        expect(404).
        expect(`Content-Type`, /html/);

      const error = JSON.parse(response.text);
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Оффер с датой "${offerDate}" не найден`
        }
      ]);
    });
  });

  context(`when offer does not exist and accept is application/json`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      const response = await request(app).
      get(`/api/offers/${offerDate}`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Content-Type`, /json/);

      const error = response.body;
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Оффер с датой "${offerDate}" не найден`
        }
      ]);
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
      const response = await request(app).
        get(`/api/offers/${offerDate}/avatar`).
        set(`Accept`, `text/html`).
        expect(404).
        expect(`Content-Type`, /html/);

      const error = JSON.parse(response.text);
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Аватар для оффера с датой "${offerDate}" не найден`
        }
      ]);
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      const response = await request(app).
        get(`/api/offers/${offerDate}/avatar`).
        set(`Accept`, `application/json`).
        expect(400).
        expect(`Content-Type`, /json/);

      const error = response.body;
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Оффер с датой "${offerDate}" не найден`
        }
      ]);
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
      const response = await request(app).
        get(`/api/offers/${offerDate}/preview/2`).
        set(`Accept`, `text/html`).
        expect(404).
        expect(`Content-Type`, /html/);

      const error = JSON.parse(response.text);
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Фото для оффера с датой "${offerDate}" не найдено`
        }
      ]);
    });
  });

  context(`when offer does not exist`, () => {
    it(`returns 404`, async () => {
      const offerDate = 12345;

      const response = await request(app).
        get(`/api/offers/${offerDate}/preview/0`).
        set(`Accept`, `text/html`).
        expect(400).
        expect(`Content-Type`, /html/);

      const error = JSON.parse(response.text);
      assert.deepStrictEqual(error, [
        {
          error: `Error`,
          errorMessage: `Оффер с датой "${offerDate}" не найден`
        }
      ]);
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

    context(`when accept is text/thml`, () => {
      it(`returns array of errors`, async () => {
        const response = await request(app).
          post(`/api/offers`).
          send({features: [`test`]}).
          set(`Accept`, `text/html`).
          set(`Content-Type`, `application/json`).
          expect(400).
          expect(`Content-Type`, /html/);

        const offer = response.text;
        assert.deepStrictEqual(offer, JSON.stringify(validationErrors));
      });
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


    context(`when accept is text/thml`, () => {
      it(`returns array of errors`, async () => {
        const response = await request(app).
          post(`/api/offers`).
          field(`features`, [`test`]).
          attach(`avatar`, `test/fixtures/file.txt`).
          attach(`preview`, `test/fixtures/file.txt`).
          set(`Accept`, `text/html`).
          set(`Content-Type`, `multipart/form-data`).
          expect(400).
          expect(`Content-Type`, /html/);

        const offer = response.text;
        assert.deepStrictEqual(offer, JSON.stringify(validationErrorsWithFiles));
      });
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

  context(`when content type is json and features is string`, () => {
    it(`returns offer`, async () => {
      validOfferAttributes.features = `wifi`;

      const response = await request(app).
        post(`/api/offers`).
        send(validOfferAttributes).
        set(`Accept`, `application/json`).
        set(`Content-Type`, `application/json`).
        expect(200).
        expect(`Content-Type`, /json/);

      const result = response.body;
      delete result.offer.photos;
      validOfferAttributes.features = [`wifi`];
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
