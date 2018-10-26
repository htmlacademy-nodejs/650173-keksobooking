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

  async getAllOffers() {
    return new Cursor(this.offers);
  }

  async save() {
    return {
      insertedId: 42
    };
  }

}

module.exports = (() => {
  let offers = [];

  for (let i = 0; i < 5; i++) {
    const offer = Data.generate();
    offer._id = i;
    offers.push(offer);
  }

  return new OffersStoreMock(offers);
})();
