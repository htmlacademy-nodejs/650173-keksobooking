'use strict';

const Command = require(`./src/command`);
const DefaultCommand = require(`./src/commands/default`);
const userCommand = process.argv[2];

if (!userCommand) {
  new DefaultCommand(Command).execute();
} else {
  new Command(userCommand).handle();
}
