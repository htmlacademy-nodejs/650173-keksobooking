'use strict';

const versionCommand = require(`./commands/version`);
const authorCommand = require(`./commands/author`);
const helpCommand = require(`./commands/help`);
const defaultCommand = require(`./commands/default`);
const errorCommand = require(`./commands/error`);

const ExitStatuses = {
  OK: 1,
  ERROR: 0
};

class Command {
  constructor(userCommand) {
    this.userCommand = userCommand;
    this.commands = [
      helpCommand,
      versionCommand,
      authorCommand
    ];
    this.availableCommands = [
      defaultCommand,
      versionCommand,
      authorCommand
    ];
  }

  static exitWithoutError() {
    process.exit(ExitStatuses.OK);
  }

  static exitWithError() {
    process.exit(ExitStatuses.ERROR);
  }

  handle() {
    this.checkHelpCommand();
    this.checkAvailableCommands()
      .then(() => Command.exitWithoutError());
    // this.showErrorAndExit();
  }

  checkAvailableCommands() {
    const commands = this.availableCommands.filter((command) => this.userCommand === command.name);
    return Promise.all(commands.map((command) => command.execute()));
  }

  checkHelpCommand() {
    if (this.userCommand === helpCommand.name) {
      helpCommand
        .execute(this.commands)
        .then(() => Command.exitWithoutError());
    }
  }

  showErrorAndExit() {
    errorCommand
      .execute(this.userCommand)
      .then(() => Command.exitWithError());
  }
}

module.exports = {
  command: Command
};
