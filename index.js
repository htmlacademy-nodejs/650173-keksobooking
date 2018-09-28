'use strict';

const util = require(`util`);

const Project = {
  VERSION: `v0.0.1`,
  NAME: `KeksoBooking`,
  AUTHOR: `Pavel Rodionov`,
};
const ExitStatuses = {
  OK: 1,
  ERROR: 0
};
const CommandMessages = {
  HELP: `Доступные команды:\n--help — печатает этот текст;\n--version — печатает версию приложения;`,
  DEFAULT: `Привет пользователь!\nЭта программа будет запускать сервер «${ Project.NAME }».\nАвтор: ${ Project.AUTHOR }.`,
  ERROR: `Неизвестная команда %s.\nЧтобы прочитать правила использования приложения, наберите "--help"`
};

class KeksoBooking {
  static handleCommand(command) {
    switch (command) {
      case `--help`:
        console.log(CommandMessages.HELP);
        process.exit(ExitStatuses.OK);
        break;
      case `--version`:
        console.log(Project.VERSION);
        process.exit(ExitStatuses.OK);
        break;
      case undefined:
        console.log(CommandMessages.DEFAULT);
        process.exit(ExitStatuses.OK);
        break;
      default:
        console.error(util.format(CommandMessages.ERROR, command));
        process.exit(ExitStatuses.ERROR);
    }
  }
}

KeksoBooking.handleCommand(process.argv[2]);
