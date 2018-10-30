'use strict';

const readline = require(`readline`);
const packageInfo = require(`../../package.json`);

class DefaultCommand {
  constructor(Command) {
    this.Command = Command;
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  execute() {
    console.log(`Hey there!\nThis app will execute the server for «${ packageInfo.name }».\nAuthor: ${ packageInfo.author }\n`);
    console.log(`Write --help to get available commands`);

    return this.readline.question(`Enter the command: `, (userCommand) => {
      new this.Command(userCommand).handle();
    });
  }
}

module.exports = DefaultCommand;
