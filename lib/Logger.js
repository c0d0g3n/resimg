const _mes = (args) => {
  return Array.prototype.join.call(args, ' ')
}

const Logger = class {
  constructor(isSilent = false, colors = true) {
    this._isSilent = isSilent
    this._blue = colors ? '\x1b[34m' : ''
    this._green = colors ? '\x1b[32m' : ''
    this._red = colors ? '\x1b[31m' : ''
    this._reset = colors ? '\x1b[0m' : ''
  }

  info() {
    if (!this._isSilent) {
      console.log(this._blue, _mes(arguments), this._reset)
    }

    // enable chaining
    return this
  }

  success() {
    if (!this._isSilent) {
      console.log(this._green, _mes(arguments), this._reset)
    }

    // enable chaining
    return this
  }

  error() {
    if (!this._isSilent) {
      console.error(this._red, _mes(arguments), this._reset)
    }

    // enable chaining
    return this
  }

  enter() {
    if (!this._isSilent) {
      console.log('\r')
    }

    // enable chaining
    return this
  }

}

module.exports = Logger
