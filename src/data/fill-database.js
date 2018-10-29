'use strict';

const {Data} = require(`./data`);
const OffersStore = require(`../app/offers/store`);

const OFFERS_COUNT = 25;

class FillDatabase {
  constructor(offersCount = OFFERS_COUNT) {
    this._offersCount = offersCount;
  }

  start() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this._addNewOffers();
    });
  }

  async _addNewOffers() {
    console.log(`Starting to add new ${this._offersCount} offers`);

    for (let i = 0; i < this._offersCount; i++) {
      const generatedOffer = Data.generate();
      await OffersStore.save(generatedOffer);

      console.log(`${i + 1} offer has been added successfully`);
    }

    console.log(`All offers has been added`);

    this.resolve();
  }
}

module.exports = FillDatabase;
