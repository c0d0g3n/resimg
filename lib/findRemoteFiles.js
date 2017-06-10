const Promise = require('bluebird')
const ftp = require('./ftp')
const path = require('path')

// ftp:     (Jsftp instance) Connection to ftp server
// dir:     (string)  root of search
// flatten: (bool)    return paths as one-dimensional Array
// files:   (array)   array in which results are stored;
//                    used by recursive calls, to remember info
findRemoteFiles = (dir, flatten=true, files = []) => {

  return ftp
    .lsAsync(dir)
    .then((items) => { // items = files || dirs
      return Promise.map(items, (item) => {
        itemPath = path.resolve(dir, item.name)

        if (item.type === 1) {
          // item is dir
          return findRemoteFiles(itemPath, false, files)
        } else {
          // item is file (or symlink or unknown, which we treat as files...)
          files.push(itemPath)
          return itemPath
        }
      })
    })
    .then((fileTree) => {
        // every task is completed, provide results
        return flatten ? files : fileTree
      })

}

module.exports = findRemoteFiles
