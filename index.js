const PROJECT = {
  VERSION: `v0.0.1`,
  NAME: `KeksoBooking`,
  AUTHOR: `Pavel Rodionov`,
};
const EXIT_STATUSES = {
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
       process.exit(EXIT_STATUSES.OK);
     case `--version`:
       console.log(PROJECT.VERSION);
       process.exit(EXIT_STATUSES.OK);
     case undefined:
       console.log(
         `Привет пользователь!\n` +
         `Эта программа будет запускать сервер «${ PROJECT.NAME }».\n` +
         `Автор: ${ PROJECT.AUTHOR }.`
       );
       process.exit(EXIT_STATUSES.OK);
     default:
       console.error(
         `Неизвестная команда ${ command }.\n` +
         `Чтобы прочитать правила использования приложения, наберите "--help"`
       );
       process.exit(EXIT_STATUSES.ERROR);
   }
 }
}

KeksoBooking.handleCommand(process.argv[2]);
