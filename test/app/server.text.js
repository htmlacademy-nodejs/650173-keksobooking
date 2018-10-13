'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const {Server, offers} = require(`../../src/app/server`);
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
      data: offers,
      total: offers.length,
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
      const partOfOffers = offers.slice(skip).slice(0, limit);
      assert.deepStrictEqual(requestedOffers, {
        data: partOfOffers,
        skip,
        limit,
        total: partOfOffers.length
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
      const offerDate = offers[0].date;

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
