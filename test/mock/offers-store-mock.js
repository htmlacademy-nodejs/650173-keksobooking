'use strict';

const Cursor = require(`./cursor-mock`);
const {Data} = require(`../../src/data/data`);

class OffersStoreMock {
  constructor(offers) {
    this.offers = offers;
  }

  async getOffer(date) {
    return this.offers.filter((it) => it.date === date)[0];
  }

  async getAllOffers(_skip, _limit) {
    return new Cursor(this.offers);
  }

  async save() {
    return {
      insertedId: 42
    };
  }

}

module.exports = new OffersStoreMock([Data.generate()]);
