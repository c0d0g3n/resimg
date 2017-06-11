const path = require('path');
const ftp = require('../lib/ftp')
const Logger = require('../lib/Logger')
const removeRemoteDir = require('../lib/removeRemoteDir')
const settings = require('../lib/settings')

exports.command = 'clear-remote'
exports.desc = `remove all files in '${settings.remoteDir}' at 'ftp://${settings.ftpUser}@${settings.ftpHost}:${settings.ftpPort}'`
exports.handler = (argv) => {
  // logger
  const log = new Logger(argv.s)

  // normalize remoteDir
  const remoteDir = path.normalize(settings.remoteDir).replace('\\', '/')

  // operation
  const clearRemote = () => {
    removeRemoteDir(remoteDir)
      .then(() => {
        log.success('removed', remoteDir)
        process.exit(0)
      })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  }

  // show warning (if not force)
  if (!argv.f) {
    log.error(`Do you really want to remove the contents of '${remoteDir}' at 'ftp://${settings.ftpUser}@${settings.ftpHost}:${settings.ftpPort}'? (y/N)`)

    // wait on imput
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (text) => {
      if (text === 'y\n' || text === 'Y\n' || text === 'yes\n' || text === 'YES\n') {
        clearRemote()
      } else {
        log.info('operation cancelled')
        process.exit(0)
      }
    })
  } else {
    clearRemote()
  }
}
