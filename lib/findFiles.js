const Promise = require('bluebird')
const fs = require('fs')
Promise.promisifyAll(fs)
const path = require('path')

findFiles = (dir, files = []) => {

  return fs.readdirAsync(dir)
    .then((items) => { // items = files || dirs

      // items figures as list of tasks, settled promise means task is completed
      return Promise.map(items, (item) => {
        item = path.resolve(dir, item)

        return fs.statAsync(item)
          .then((stat) => {
            if (stat.isFile()) {
              // item is file
              files.push(item)
            } else if (stat.isDirectory()) {
              // item is dir
              // note: we only care about this being a promise, not it's resolved value
              return findFiles(item, files)
            }
          })
      })

    })
    .then(() => {
      // every task is completed, provide results
      return files
    })

}

module.exports = findFiles
