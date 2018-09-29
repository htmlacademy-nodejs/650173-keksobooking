'use strict';

module.exports = {
  name: `--help`,
  description: `Shows all commands with description`,
  execute(commands) {
    console.log(`Available commands:`);
    commands.forEach((command) => {
      console.log(`\t${ command.name } :: ${ command.description }`);
    });
  }
};
