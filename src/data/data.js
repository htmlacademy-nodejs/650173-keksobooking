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
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
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
  ROOMS: {MIN: 0, MAX: 1000},
  PRICE: {MIN: 1000, MAX: 1000000}
};

class Data {
  static generate() {
    const location = Data.getLocation();

    return {
      author: {
        avatar: Data.getAvatar(),
        name: Data.getName()
      },
      offer: {
        title: Data.getTitle(),
        address: Data.getAddress(location),
        price: Data.getPrice(),
        type: Data.getType(),
        rooms: Data.getRooms(),
        guests: Data.getGuests(),
        checkin: Data.getCheckin(),
        checkout: Data.getCheckout(),
        features: Data.getFeatures(),
        description: Data.getDescription(),
        photos: Data.getPhotos()
      },
      location,
      date: Data.getDate(Utils.getRandomNumber(0, PreparedData.DAYS_OFFSET))
    };
  }

  static getName() {
    return Utils.getRandomElementFromArray(PreparedData.NAMES);
  }

  static getAvatar() {
    return `https://robohash.org/${Utils.getRandomNumber(1, 1000)}-${Utils.getRandomNumber(1, 1000)}`;
  }

  static getTitle() {
    return Utils.getRandomElementFromArray(PreparedData.TITLE);
  }

  static getAddress(getLocation) {
    return `${ getLocation.x }, ${ getLocation.y }`;
  }

  static getPrice() {
    return Utils.getRandomNumber(PreparedData.PRICE.MIN, PreparedData.PRICE.MAX);
  }

  static getType() {
    return Utils.getRandomElementFromArray(PreparedData.TYPES);
  }

  static getRooms() {
    return Utils.getRandomNumber(PreparedData.ROOMS.MIN, PreparedData.ROOMS.MAX);
  }

  static getGuests() {
    return Utils.getRandomNumber(PreparedData.GUESTS.MIN, PreparedData.GUESTS.MAX);
  }

  static getCheckin() {
    return Utils.getRandomElementFromArray(PreparedData.TIMES);
  }

  static getCheckout() {
    return Utils.getRandomElementFromArray(PreparedData.TIMES);
  }

  static getFeatures() {
    return Utils.shuffleArray(PreparedData.FEATURES).slice(0, Utils.getRandomNumber(1, PreparedData.FEATURES.length));
  }

  static getDescription() {
    return ``;
  }

  static getPhotos() {
    return Utils.shuffleArray(PreparedData.PHOTOS);
  }

  static getLocation() {
    return {
      x: Utils.getRandomNumber(PreparedData.LOCATION.X.MIN, PreparedData.LOCATION.X.MAX),
      y: Utils.getRandomNumber(PreparedData.LOCATION.Y.MIN, PreparedData.LOCATION.Y.MAX)
    };
  }

  static getDate(offset) {
    return (new Date().getTime() - Utils.getDateOffset(offset)) / 1000 | 0;
  }
}

module.exports = {
  Data,
  PreparedData
};
