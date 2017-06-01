const fs = require('fs')
const path = require('path')
const defaultsPath = path.join(__dirname, '..', 'defaults.js')
const defaults = require(defaultsPath)
const settingsPath = path.join(__dirname, '..', 'settings.js')
const settings = fs.existsSync(settingsPath) ? require(settingsPath) : {}

module.exports = Object.assign({}, defaults, settings)
