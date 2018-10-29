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

  for (let i = 0; i < 2; i++) {
    const generatedOffer = Data.generate();
    // It's random problem of offer generate, it can be not unique
    if (offers.find((offer) => offer.date === generatedOffer.date)) {
      generatedOffer.date += 1;
    }
    generatedOffer._id = i + 1;
    offers.push(generatedOffer);
  }

  return new OffersStoreMock(offers);
})();
