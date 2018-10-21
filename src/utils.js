'use strict';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomElementFromArray = (array) => array[randomNumber(0, array.length - 1)];
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
const dateOffset = (offset) => MS_IN_DAY * offset;

module.exports = {
  randomNumber,
  randomElementFromArray,
  shuffleArray,
  dateOffset
};
