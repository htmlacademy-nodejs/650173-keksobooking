'use strict';

const colors = require(`colors/safe`);
const printf = require(`printf`);

const prettyCommandName = (command) => {
  const [, commandName] = command.split(`--`);
  return printf(`--%-20s`, colors.grey(commandName));
};

module.exports = {
  name: `--help`,
  description: `Shows all commands with description`,
  userCommand: true,
  execute(commands) {
    return new Promise((resolve) => {
      console.log(`Available commands:`);
      commands.forEach((command) => {
        const commandName = prettyCommandName(command.name);
        const commandDescription = colors.green(command.description);

        console.log(`${ commandName } - ${ commandDescription }`);
      });

      resolve();
    });
  }
};
