const Promise = require('bluebird')
const fs = require('fs')
Promise.promisifyAll(fs)
const path = require('path')

// dir:     (string)  root of search
// flatten: (bool)    return paths as one-dimensional Array
// files:   (array)   array in which results are stored;
//                    used by recursive calls, to remember info
findFiles = (dir, flatten=true, files = []) => {

  return fs
    .readdirAsync(dir)
    .then((items) => { // items = files || dirs

      return Promise.map(items, (item) => {
        item = path.resolve(dir, item)

        return fs.statAsync(item)
          .then((stat) => {
            if (stat.isFile()) {
              // item is file
              files.push(item)
              return item
            } else if (stat.isDirectory()) {
              // item is dir
              return findFiles(item, false, files)
            }
          })
      })

    })
    .then((fileTree) => {
      // every task is completed, provide results
      return flatten ? files : fileTree
    })

}

module.exports = findFiles
