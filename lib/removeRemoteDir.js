const Promise = require('bluebird')
const path = require('path');
const ftp = require('./ftp')

const removeRemoteDir = (dir) => {

  // store dirs for removal after they are emptied
  let dirs = []

  return ftp
    .lsAsync(dir)
    .then((items) => {
      return Promise.map(items, (item) => {
        const itemPath = path.resolve(dir, item.name)

        if (item.type === 1) {
          // item is dir, store
          dirs.push(itemPath)

          // remove files in dir
          return removeRemoteDir(itemPath)
        } else {
          // item is file, remove
          return ftp.rawAsync('dele', itemPath)
        }
      })
    })
    .then(() => {
      // remove dirs
      return Promise.map(dirs, (dir) => {
        return ftp.rawAsync('rmd', dir)
      })
    })

}

module.exports = removeRemoteDir
