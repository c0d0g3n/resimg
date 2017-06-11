const Promise = require('bluebird')
const fs = require('fs')
const path = require('path');
Promise.promisifyAll(fs)

const removeFiles = (dir, ignore) => {

  // clear contents, then remove
  let dirs = []

  return fs
    .readdirAsync(dir)
    .then((items) => {
      return Promise.map(items, (item) => {
        item = path.resolve(dir, item)

        if (item === ignore) {
          return 'ignored'
        }

        return fs.statAsync(item)
          .then((stat) => {
            if (stat.isFile()) {
              // item is file
              return fs.unlinkAsync(item)
            } else if (stat.isDirectory()) {
              // item is dir
              dirs.push(item)
              return removeFiles(item, ignore)
            }
          })
      })
    })
    .then(() => {
      // remove dirs
      return Promise.map(dirs, (dir) => {
        return fs.rmdirAsync(dir)
      })
    })

}

module.exports = removeFiles
