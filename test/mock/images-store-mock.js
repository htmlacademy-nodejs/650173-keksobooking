'use strict';

const fs = require(`fs`);

class ImagesMockStore {
  async get(_id) {
    return await fs.readFile(`./test/fixtures/keks.png`);
  }

  async save() {
    return true;
  }
}

module.exports = new ImagesMockStore();
