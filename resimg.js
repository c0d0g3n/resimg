const yargs = require('yargs')
  .usage('$0 <command> [arguments]')
  .option('s', {
    alias: 'silent',
    type: 'boolean',
    describe: 'Hide file logging'
  })
  .option('f', {
    alias: 'force',
    type: 'boolean',
    default: false,
    describe: 'Override remote files if necessary'
  })
  .commandDir('./commands')
  .demandCommand()
  .help()
  .argv
