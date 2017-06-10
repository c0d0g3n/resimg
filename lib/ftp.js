const Promise = require('bluebird')
const Jsftp = require('jsftp')
const settings = require('../lib/settings')

// create connection
const ftp = new Jsftp({
  host: settings.ftpHost,
  port: settings.ftpPort,
  user: settings.ftpUser,
  pass: settings.ftpPass,
})

// connection errors
ftp.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

// use promises
Promise.promisifyAll(ftp)

module.exports = ftp
