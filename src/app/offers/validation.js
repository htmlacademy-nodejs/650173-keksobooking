'use strict';

const {randomElementFromArray} = require(`../../utils`);
const {PreparedData} = require(`../../data`);

const CLOCK_REGEXP = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

const errorFormatter = ({msg, param}) => {
  return {
    error: `Validation Error`,
    fieldName: param,
    errorMessage: msg
  };
};

const prepareInputData = (req, res, next) => {
  const name = req.body.name;

  if (!name || name && name.length === 0) {
    req.body.name = randomElementFromArray(PreparedData.NAMES);
  }

  return next();
};

const schema = {
  title: {
    isLength: {
      options: {min: 30, max: 140}
    }
  },
  type: {
    optional: false,
    exists: true,
    isIn: {
      options: PreparedData.TYPES
    }
  },
  price: {
    isInt: {
      options: {gt: 1, lt: 100000}
    },
    toInt: true
  },
  address: {
    isLength: {
      options: {min: 1, max: 100}
    }
  },
  checkin: {
    matches: {
      options: CLOCK_REGEXP
    }
  },
  checkout: {
    matches: {
      options: CLOCK_REGEXP
    }
  },
  rooms: {
    isInt: {
      options: {gt: 0, lt: 100}
    },
    toInt: true
  },
  features: {
    optional: true,
    custom: {
      options: (value) => {
        return Array.from(value).every((elem) => PreparedData.FEATURES.indexOf(elem) > -1);
      }
    },
  },
  name: {
    optional: true
  },
  avatar: {
    custom: {
      options: (_, {req}) => {
        if (req.files && req.files.avatar && req.files.avatar[0]) {
          return !!req.files.avatar[0].mimetype.match(/image/);
        }

        return true;
      }
    }
  },
  preview: {
    custom: {
      options: (_, {req}) => {
        if (req.files && req.files.preview && req.files.preview[0]) {
          return !!req.files.preview[0].mimetype.match(/image/);
        }

        return true;
      }
    }
  }
};

module.exports = {
  schema,
  errorFormatter,
  prepareInputData
};
