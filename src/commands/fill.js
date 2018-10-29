'use strict';

const FillDatabase = require(`../data/fill-database`);

module.exports = {
  name: `--fill`,
  description: `Fill the database`,
  userCommand: true,
  execute() {
    return new FillDatabase().start();
  }
};
