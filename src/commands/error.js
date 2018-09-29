'use strict';

const util = require(`util`);
const helpCommand = require(`./help`);

module.exports = {
  execute(command) {
    const message = util.format(
        `Unknown command: «%s».\nUse "${ helpCommand.name }" for get available commands.`, command
    );

    console.error(message);
  }
};
