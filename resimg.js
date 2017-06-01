const yargs = require('yargs')
  .usage('$0 <command> [arguments]')
  .option('s', {
    alias: 'silent',
    type: 'boolean',
    describe: 'Hide file logging'
  })
  .commandDir('./commands')
  .demandCommand()
  .help()
  .argv
