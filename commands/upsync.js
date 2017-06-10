const Promise = require('bluebird')
const ftp = require('../lib/ftp')
const path = require('path')
const settings = require('../lib/settings')
const createRemoteDir = require('../lib/createRemoteDir')
const findFiles = require('../lib/findFiles')
const findRemoteFiles = require('../lib/findRemoteFiles');
const Logger = require('../lib/Logger')

exports.command = 'upsync'
exports.desc = 'Update remoteDir so that it is in sync with outputDir'
exports.handler = (argv) => {
  // logger
  const log = new Logger(argv.s)

  // normalize remoteDir
  const remoteDir = path.normalize(settings.remoteDir).replace('\\', '/')

  // TASK FINDREMOTE
  // part 1: make sure settings.remoteDir exists (should go into separate task as soon as jsftp supports it)
  // part 2: create a array with remote files
  const findRemote = ftp
      .rawAsync('cwd', remoteDir)
      .catch((err) => {
        if (err.code === 550) {
          // remoteDir is not available, attempt to create
          // note: remoteDir is CWD after operation
          return createRemoteDir(remoteDir)
        } else {
          // propagate error
          throw err
        }
      })
      // part 2: array with remote files
      .then(() => {
        return findRemoteFiles(remoteDir, true)
      })

  // TASK FINDLOCAL
  // create a 2d array of local files
  const findLocal = findFiles(settings.outputDir, true)

  Promise
    .join(findLocal, findRemote)
    .then((taskResults) => {
      const localFiles = taskResults[0]
      const remoteFiles = taskResults[1]

      // console.log(localFiles);

      return Promise.each(localFiles, (file) => {
        // rebase
        let remoteFile = path.relative(settings.outputDir, file)
        remoteFile = path.resolve(remoteDir, remoteFile)

        // should upload?
        let upload = true

        // prevent uploading if necessary (=remote counterpart exists, no force)
        if (remoteFiles.includes(remoteFile) && !argv.f) {
          upload = false
          log.error('cancelled', file, '(exists already on remote)')
        }

        if (upload) {
          // console.log(file);
          // console.log(remoteFile);
          return ftp
            .putAsync(file, remoteFile)
            .catch((err) => {
              if (err.code === 553) {
                // could not create file, folder probably does not exist
                // note: remoteDir is CWD after operation
                return createRemoteDir(path.dirname(remoteFile))
                  .then((path) => {
                    log.info('created', path)
                    // retry
                    return ftp.putAsync(file, remoteFile)
                  })
              } else {
                // propagate error
                throw err
              }
            })
            .then(() => {
              log.success('put', file, '>', remoteFile)
            })
        }
      })
    })
    .then((test) => {
      log.info('Job\'s done!')
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })

}
