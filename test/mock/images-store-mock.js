'use strict';

class FakeStream {
  async on() {
    return true;
  }

  async pipe(res) {
    return await res.end();
  }
}

class FakeImage {
  get info() {
    return {contentType: `image/jpeg`, length: 100};
  }

  get stream() {
    return new FakeStream();
  }
}

class ImagesMockStore {
  async get(id) {
    if (id === 1 || id === `1-1`) {
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
