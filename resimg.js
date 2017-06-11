const yargs = require('yargs')
  .usage('$0 <command> [arguments]')
  .option('s', {
    alias: 'silent',
    type: 'boolean',
    describe: 'Do not output to terminal'
  })
  .option('f', {
    alias: 'force',
    type: 'boolean',
    describe: 'Do not ask permission for dangerous operations (overriding/removing...)'
  })
  .commandDir('./commands')
  .demandCommand()
  .help()
  .argv
