const Promise = require('bluebird')
const ftp = require('./ftp')
const path = require('path')

const createRemoteDir = (remoteDir) => {
  // dissect remoteDir
  let remotePath = remoteDir.split('/')
  remotePath.shift()

  return ftp
    .rawAsync('cwd', '/') // make sure we are in the root dir of remote (arguments should be absolute)
    .then(() => {
      return Promise.each(remotePath, (part) => {
        return ftp
          .rawAsync('cwd', part)
          .catch((err) => {
            if (err.code === 550) {

              // part does not exist yet, create dir
              return ftp
                .rawAsync('mkd', part)
                .return(ftp.rawAsync('cwd', part))

            } else {
              // propagate error
              throw err
            }
          })
      })
    })
    .then(() => {
      // return path that was created (normalized)
      return path.join('/', ...remotePath)
    })
}

module.exports = createRemoteDir
