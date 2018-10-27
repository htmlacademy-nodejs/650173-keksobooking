'use strict';

const {DefaultsPageSettings} = require(`./constants`);

const MS_IN_DAY = 24 * 60 * 60 * 1000;

class Utils {
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomElementFromArray(array) {
    return array[Utils.randomNumber(0, array.length - 1)];
  }

  static shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  static dateOffset(offset) {
    return MS_IN_DAY * offset;
  }

  static async toPage(cursor, skip = DefaultsPageSettings.SKIP, limit = DefaultsPageSettings.LIMIT) {
    const packet = await cursor.skip(skip).limit(limit).toArray();

    return {
      data: packet,
      skip,
      limit,
      total: await cursor.count()
    };
  }
}

module.exports = Utils;
