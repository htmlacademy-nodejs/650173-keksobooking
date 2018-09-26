const Project = {
  VERSION: `v0.0.1`,
  NAME: `KeksoBooking`,
  AUTHOR: `Pavel Rodionov`,
};
const ExitStatuses = {
  OK: 1,
  ERROR: 0
};

class KeksoBooking {
 static handleCommand(command) {
   switch (command) {
     case `--help`:
       console.log(
         `Доступные команды:\n` +
         `--help    — печатает этот текст;\n` +
         `--version — печатает версию приложения;`
       );
       process.exit(ExitStatuses.OK);
     case `--version`:
       console.log(Project.VERSION);
       process.exit(ExitStatuses.OK);
     case undefined:
       console.log(
         `Привет пользователь!\n` +
         `Эта программа будет запускать сервер «${ Project.NAME }».\n` +
         `Автор: ${ Project.AUTHOR }.`
       );
       process.exit(ExitStatuses.OK);
     default:
       console.error(
         `Неизвестная команда ${ command }.\n` +
         `Чтобы прочитать правила использования приложения, наберите "--help"`
       );
       process.exit(ExitStatuses.ERROR);
   }
 }
}

KeksoBooking.handleCommand(process.argv[2]);
