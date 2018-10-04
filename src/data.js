'use strict';

const PreparedData = {
  TITLE: [
    `Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`
  ],
  TYPE: [`flat`, `palace`, `house`, `bungalo`],
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
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomElementFromArray = (array) => array[randomNumber(0, array.length - 1)];
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
const dateOffset = (offset) => MS_IN_DAY * offset;

class Data {
  static generate() {
    const location = Data.location();

    return {
      author: {
        avatar: Data.avatar()
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
      date: Data.date(randomNumber(0, PreparedData.DAYS_OFFSET))
    };
  }

  static avatar() {
    return `https://robohash.org/${randomNumber(1, 1000)}-${randomNumber(1, 1000)}`;
  }

  static title() {
    return randomElementFromArray(PreparedData.TITLE);
  }

  static address(location) {
    return `${ location.x }, ${ location.y }`;
  }

  static price() {
    return randomNumber(PreparedData.PRICE.MIN, PreparedData.PRICE.MAX);
  }

  static type() {
    return randomElementFromArray(PreparedData.TYPE);
  }

  static rooms() {
    return randomNumber(PreparedData.ROOMS.MIN, PreparedData.ROOMS.MAX);
  }

  static guests() {
    return randomNumber(PreparedData.GUESTS.MIN, PreparedData.GUESTS.MAX);
  }

  static checkin() {
    return randomElementFromArray(PreparedData.TIMES);
  }

  static checkout() {
    return randomElementFromArray(PreparedData.TIMES);
  }

  static features() {
    return shuffleArray(PreparedData.FEATURES).slice(0, randomNumber(1, PreparedData.FEATURES.length));
  }

  static description() {
    return ``;
  }

  static photos() {
    return shuffleArray(PreparedData.PHOTOS);
  }

  static location() {
    return {
      x: randomNumber(PreparedData.LOCATION.X.MIN, PreparedData.LOCATION.X.MAX),
      y: randomNumber(PreparedData.LOCATION.Y.MIN, PreparedData.LOCATION.Y.MAX)
    };
  }

  static date(offset) {
    return (new Date().getTime() - dateOffset(offset)) / 1000 | 0;
  }
}

module.exports = {
  Data,
  PreparedData
};
