'use strict';

const util = require(`util`);
const colors = require(`colors/safe`);
const helpCommand = require(`./help`);

module.exports = {
  execute(command) {
    const unknownCommandMessage = util.format(`Unknown command: «%s».`, command);
    const message = [
      colors.red(unknownCommandMessage),
      `Use "${ helpCommand.name }" for get available commands.`
    ].join(`\n`);

    console.error(message);
  }
};
