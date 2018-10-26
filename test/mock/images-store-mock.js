'use strict';

const fs = require(`fs`);

class FakeStream {
  async on() {
    return true;
  }

  async pipe(res) {
    return await res.end();
  }
}

class FakeImage {
  async info() {
    return await fs.readFileAsync(`./test/fixtures/keks.png`);
  }

  get stream() {
    return new FakeStream();
  }
}

class ImagesMockStore {
  async get(id) {
    if (id === 0) {
      return await new FakeImage();
    } else {
      return false;
    }
  }

  async save() {
    return true;
  }
}

module.exports = new ImagesMockStore();
