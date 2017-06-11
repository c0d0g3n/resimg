const _mes = (args) => {
  args = Array.from(args)

  if (typeof args[args.length - 1] === 'boolean') {
    args.pop()
  }

  return args.join(' ')
}

const Logger = class {
  constructor(isSilent = false, colors = true) {
    this.isSilent = isSilent
    this.blue = colors ? '\x1b[34m' : ''
    this.green = colors ? '\x1b[32m' : ''
    this.red = colors ? '\x1b[31m' : ''
    this.reset = colors ? '\x1b[0m' : ''
  }

  info() {
    if (this.shouldLog(arguments)) {
      console.log(this.blue + _mes(arguments) + this.reset)
    }

    // enable chaining
    return this
  }

  success() {
    if (this.shouldLog(arguments)) {
      console.log(this.green + _mes(arguments) + this.reset)
    }

    // enable chaining
    return this
  }

  error() {
    if (this.shouldLog(arguments)) {
      console.error(this.red + _mes(arguments) + this.reset)
    }

    // enable chaining
    return this
  }

  enter() {
    if (this.shouldLog(arguments)) {
      console.log('\r')
    }

    // enable chaining
    return this
  }


  shouldLog(args) {
      if (typeof args[args.length - 1] === 'boolean' && args[args.length - 1]) {
        // log when last argument is true
        return true
      } else if (!this.isSilent) {
        // log when not in silent mode
        return true
      } else {
        return false
      }
  }

}

module.exports = Logger
