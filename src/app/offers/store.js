'use strict';

const db = require(`../../db`);
const Utils = require(`../../utils`);

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`offers`);

  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    return (await this.collection).findOne({date});
  }

  async getAllOffers(skip, limit) {
    const result = (await this.collection).find();

    return Utils.toPage(result, skip, limit);
  }

  async save(offerData) {
    return (await this.collection).insertOne(offerData);
  }
}

module.exports = new OffersStore(
    setupCollection().
      catch((error) => console.error(`Failed to set up "offers"-collection`, error))
);
