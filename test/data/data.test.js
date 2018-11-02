'use strict';

const assert = require(`assert`);
const {Data, PreparedData} = require(`../../src/data/data`);

let generatedData;

describe(`Data.generate()`, () => {
  before(function () {
    generatedData = Data.generate();
  });

  it(`should generate correct address`, () => {
    assert.strictEqual(`${generatedData.location.x}, ${generatedData.location.y}`, generatedData.offer.address);
  });

  it(`should generate correct rooms`, () => {
    const rooms = PreparedData.ROOMS;
    assert(generatedData.offer.rooms >= rooms.MIN && generatedData.offer.rooms <= rooms.MAX);
  });

  it(`should generate correct price`, () => {
    const price = PreparedData.PRICE;
    assert(generatedData.offer.price >= price.MIN && generatedData.offer.rooms <= price.MAX);
  });

  it(`should generate correct checkin and checkout`, () => {
    assert(PreparedData.TIMES.includes(generatedData.offer.checkin));
    assert(PreparedData.TIMES.includes(generatedData.offer.checkout));
  });

  it(`should generate correct title`, () => {
    assert(PreparedData.TITLE.includes(generatedData.offer.title));
  });

  it(`should generate correct type`, () => {
    assert(PreparedData.TYPES.includes(generatedData.offer.type));
  });

  it(`should generate correct features`, () => {
    assert.strictEqual(generatedData.offer.features.filter((x) => !PreparedData.FEATURES.includes(x)).length, 0);
  });

  it(`should generate correct description`, () => {
    assert.strictEqual(generatedData.offer.description, ``);
  });

  it(`should generate correct guests`, () => {
    assert(!isNaN(generatedData.offer.guests));
  });

  it(`should generate correct photos`, () => {
    assert.deepEqual(generatedData.offer.photos.sort(), PreparedData.PHOTOS);
  });

  describe(`author`, () => {
    it(`should generate correct name`, () => {
      assert(PreparedData.NAMES.includes(generatedData.author.name));
    });

    it(`should generate correct avatar`, () => {
      assert(generatedData.author.avatar.includes(`https://robohash.org/`));
    });
  });

  describe(`location`, () => {
    it(`should generate correct location`, () => {
      const location = PreparedData.LOCATION;

      assert(generatedData.location.x >= location.X.MIN && generatedData.location.x <= location.X.MAX);
      assert(generatedData.location.y >= location.Y.MIN && generatedData.location.y <= location.Y.MAX);
    });
  });

  describe(`date`, () => {
    it(`should generate correct date`, () => {
      const currentDate = Data.getDate(0);
      const pastDate = Data.getDate(PreparedData.DAYS_OFFSET);

      assert(generatedData.date <= currentDate && generatedData.date >= pastDate);
    });
  });
});
