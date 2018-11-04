'use strict';

const {ExitStatuses} = require(`./constants`);
const versionCommand = require(`./commands/version`);
const authorCommand = require(`./commands/author`);
const helpCommand = require(`./commands/help`);
const errorCommand = require(`./commands/error`);
const serverCommand = require(`./commands/server`);
const fillCommand = require(`./commands/fill`);

class Command {
  constructor(userCommand, interactiveInput = false) {
    this.interactiveInput = interactiveInput;
    this.userCommand = this._prepareCommand(userCommand);
    this.commands = [
      helpCommand,
      versionCommand,
      authorCommand,
      serverCommand,
      fillCommand
    ];
  }

  handle() {
    this._checkHelpCommand();
    this._checkCommands()
      .then(Command.exitWithoutError)
      .catch(() => this._showErrorAndExit());
  }

  _prepareCommand(userCommand) {
    if (this.interactiveInput) {
      return `--` + userCommand.replace(/^--/, ``);
    } else {
      return userCommand;
    }
  }

  _checkCommands() {
    const commands = this.commands.filter((command) => {
      return this.userCommand === command.name && this.userCommand !== helpCommand.name;
    });

    if (commands.length === 0) {
      return new Promise(() => {
        throw new Error(`Commands not found`);
      });
    } else {
      return Promise.all(commands.map((command) => command.execute()));
    }
  }

  _checkHelpCommand() {
    if (this.userCommand === helpCommand.name) {
      helpCommand
        .execute(this.commands.filter((command) => command.userCommand), this.interactiveInput)
        .then(Command.exitWithoutError);
    }
  }

  _showErrorAndExit() {
    errorCommand
      .execute(this.userCommand)
      .then(Command.exitWithError);
  }

  static exitWithoutError() {
    process.exit(ExitStatuses.OK);
  }

  static exitWithError() {
    process.exit(ExitStatuses.ERROR);
  }
}

module.exports = Command;
