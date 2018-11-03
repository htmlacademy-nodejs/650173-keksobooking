'use strict';

const db = require(`../../db`);
const logger = require(`../../logger`);

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

  async getAllOffers() {
    return (await this.collection).find();
  }

  async save(offerData) {
    return (await this.collection).insertOne(offerData);
  }
}

module.exports = new OffersStore(
    setupCollection().
      catch((error) => logger.error(`Failed to set up "offers"-collection`, error))
);
