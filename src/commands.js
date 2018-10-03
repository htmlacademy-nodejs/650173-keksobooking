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
    this.checkAvailableCommands();
    this.showErrorAndExit();
  }

  checkAvailableCommands() {
    this.availableCommands.forEach((command) => {
      if (this.userCommand === command.name) {
        command.execute();
        Command.exitWithoutError();
      }
    });
  }

  checkHelpCommand() {
    if (this.userCommand === helpCommand.name) {
      helpCommand.execute(this.commands);
      Command.exitWithoutError();
    }
  }

  showErrorAndExit() {
    errorCommand.execute(this.userCommand);
    Command.exitWithError();
  }
}

module.exports = {
  command: Command
};
