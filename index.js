'use strict';

require(`dotenv`).config();

const Command = require(`./src/command`);
const userCommand = process.argv[2];

new Command(userCommand).handle();
