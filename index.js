'use strict';

const Command = require(`./src/commands`).command;
const userCommand = process.argv[2];

new Command(userCommand).handle();
