'use strict';

const Utils = require(`../utils`);

const PreparedData = {
  NAMES: [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`],
  TITLE: [
    `Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`
  ],
  TYPES: [`flat`, `palace`, `house`, `bungalo`],
  TIMES: [`12:00`, `13:00`, `14:00`],
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`, `description`],
  PHOTOS: [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
  ],
  DAYS_OFFSET: 7,
  LOCATION: {
    X: {MIN: 300, MAX: 900},
    Y: {MIN: 150, MAX: 500}
  },
  GUESTS: {MIN: 1, MAX: 10},
  ROOMS: {MIN: 1, MAX: 5},
  PRICE: {MIN: 1000, MAX: 1000000}
};

class Data {
  static generate() {
    const location = Data.location();

    return {
      author: {
        avatar: Data.avatar(),
        name: Data.name()
      },
      offer: {
        title: Data.title(),
        address: Data.address(location),
        price: Data.price(),
        type: Data.type(),
        rooms: Data.rooms(),
        guests: Data.guests(),
        checkin: Data.checkin(),
        checkout: Data.checkout(),
        features: Data.features(),
        description: Data.description(),
        photos: Data.photos()
      },
      location,
      date: Data.date(Utils.randomNumber(0, PreparedData.DAYS_OFFSET))
    };
  }

  static name() {
    return Utils.randomElementFromArray(PreparedData.NAMES);
  }

  static avatar() {
    return `https://robohash.org/${Utils.randomNumber(1, 1000)}-${Utils.randomNumber(1, 1000)}`;
  }

  static title() {
    return Utils.randomElementFromArray(PreparedData.TITLE);
  }

  static address(location) {
    return `${ location.x }, ${ location.y }`;
  }

  static price() {
    return Utils.randomNumber(PreparedData.PRICE.MIN, PreparedData.PRICE.MAX);
  }

  static type() {
    return Utils.randomElementFromArray(PreparedData.TYPES);
  }

  static rooms() {
    return Utils.randomNumber(PreparedData.ROOMS.MIN, PreparedData.ROOMS.MAX);
  }

  static guests() {
    return Utils.randomNumber(PreparedData.GUESTS.MIN, PreparedData.GUESTS.MAX);
  }

  static checkin() {
    return Utils.randomElementFromArray(PreparedData.TIMES);
  }

  static checkout() {
    return Utils.randomElementFromArray(PreparedData.TIMES);
  }

  static features() {
    return Utils.shuffleArray(PreparedData.FEATURES).slice(0, Utils.randomNumber(1, PreparedData.FEATURES.length));
  }

  static description() {
    return ``;
  }

  static photos() {
    return Utils.shuffleArray(PreparedData.PHOTOS);
  }

  static location() {
    return {
      x: Utils.randomNumber(PreparedData.LOCATION.X.MIN, PreparedData.LOCATION.X.MAX),
      y: Utils.randomNumber(PreparedData.LOCATION.Y.MIN, PreparedData.LOCATION.Y.MAX)
    };
  }

  static date(offset) {
    return (new Date().getTime() - Utils.dateOffset(offset)) / 1000 | 0;
  }
}

module.exports = {
  Data,
  PreparedData
};
