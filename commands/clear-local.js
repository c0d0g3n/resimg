const path = require('path');
const Logger = require('../lib/Logger')
const settings = require('../lib/settings')
const removeFiles = require('../lib/removeFiles')

exports.command = 'clear-local'
exports.desc = `remove all files in '${settings.outputDir}' ('${settings.inputDir}' is ignored)`
exports.handler = (argv) => {
  // logger
  const log = new Logger(argv.s)

  // operation
  const clearLocal = () => {
    removeFiles(settings.outputDir, settings.inputDir)
      .then(() => {
        log.success('removed', settings.outputDir)
        process.exit(0)
      })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  }

  // show warning (if not force)
  if (!argv.f) {
    log.error(`Do you really want to remove the contents of '${settings.outputDir}'? (y/N)`)

    // wait on imput
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (text) => {
      if (text === 'y\n' || text === 'Y\n' || text === 'yes\n' || text === 'YES\n') {
        clearLocal()
      } else {
        log.info('operation cancelled')
        process.exit(0)
      }
    })
  } else {
    clearLocal()
  }
}
