// dependencies
const fs = require('fs')

// load configuration
const settings = (function () {
  const defaults = require('./defaults.js')
  const settings = fs.existsSync('./settings.js') ? require('./settings.js') : {}

  return Object.assign({}, defaults, settings)
})()
