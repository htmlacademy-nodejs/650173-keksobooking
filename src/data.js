'use strict';

const preparedData = {
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
  ROOMS: {MIN: 1, MAX: 5},
  PRICE: {MIN: 1000, MAX: 1000000}
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomElementFromArray = (array) => array[Math.floor(Math.random() * array.length)];
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
const dateOffset = (offset) => (24 * 60 * 60 * 1000) * offset;

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
      date: Data.date(random(0, preparedData.DAYS_OFFSET))
    };
  }

  static avatar() {
    return `https://robohash.org/${random(1, 1000)}-${random(1, 1000)}`;
  }

  static title() {
    return randomElementFromArray(preparedData.TITLE);
  }

  static address(location) {
    return `${ location.x }, ${ location.y }`;
  }

  static price() {
    return random(preparedData.PRICE.MIN, preparedData.PRICE.MAX);
  }

  static type() {
    return randomElementFromArray(preparedData.TYPE);
  }

  static rooms() {
    return random(preparedData.ROOMS.MIN, preparedData.ROOMS.MAX);
  }

  static guests() {
    return random(1, 10);
  }

  static checkin() {
    return randomElementFromArray(preparedData.TIMES);
  }

  static checkout() {
    return randomElementFromArray(preparedData.TIMES);
  }

  static features() {
    return shuffleArray(preparedData.FEATURES).slice(0, random(1, preparedData.FEATURES.length));
  }

  static description() {
    return ``;
  }

  static photos() {
    return shuffleArray(preparedData.PHOTOS);
  }

  static location() {
    return {
      x: random(preparedData.LOCATION.X.MIN, preparedData.LOCATION.X.MAX),
      y: random(preparedData.LOCATION.Y.MIN, preparedData.LOCATION.Y.MAX)
    };
  }

  static date(offset) {
    return (new Date().getTime() - dateOffset(offset)) / 1000 | 0;
  }
}

module.exports = {
  data: Data,
  preparedData
};
