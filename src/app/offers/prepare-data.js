'use strict';

const getLocationFromAddress = (address) => {
  const [x, y] = address.replace(` `, ``).split(`,`);

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  };
};

const prepareData = ({body, files}) => {
  const offer = Object.assign({}, body);
  const date = (new Date()).getTime();

  const location = getLocationFromAddress(offer.address);
  const author = {name: offer.name};
  delete offer.name;

  if (files) {
    if (files.avatar && files.avatar[0]) {
      author.avatar = `/api/offers/${date}/avatar`;
      delete offer.avatar;
    }

    if (files.preview) {
      offer.photos = files.preview.map((p, i) => `/api/offers/${date}/preview/${i}`);
      delete offer.preview;
    }
  }

  offer.photos = offer.photos ? offer.photos : [];
  offer.features = offer.features ? offer.features : [];

  return {author, offer, location, date};
};

module.exports = prepareData;
