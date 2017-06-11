const Promise = require('bluebird')
const mkdirp = require('mkdirp')
const gm = require('gm')
const path = require('path')
const settings = require('../lib/settings')
const findFiles = require('../lib/findFiles')
const Logger = require('../lib/Logger')

exports.command = 'resize'
exports.desc = `Resize images from '${settings.inputDir}' and store in '${settings.outputDir}/[size]'.`
exports.handler = (argv) => {
  // initialize new terminal printer
  const log = new Logger(argv.s)

  // output config info
  log
    .info('Input:', '\t', settings.inputDir)
    .info('Output:', '\t', settings.outputDir)
    .info('Sizes:', '\t', settings.sizes)
    .enter()

  findFiles(settings.inputDir)
    .then((files) => {
      // resize files
      return Promise.map(files, (file) => {
        // shorter path for logging
        const shortFile = path.relative(settings.outputDir, file)

        return Promise
          .fromCallback((callback) => {
            gm(file).format(callback)
          })
          .then((ext) => {
            // array with promises to track every resize
            let resizes = []

            for (const size of settings.sizes) {
              // output file
              let outFile = path.relative(settings.inputDir, file)
              outFile = path.join(settings.outputDir, String(size), outFile)

              // output dir
              let outDir = path.dirname(outFile)

              // make sure output dir exists
              mkdirp.sync(outDir)

              // resize
              const resize = Promise.fromCallback((callback) => {
                gm(file)
                  .resize(size)
                  .write(outFile, callback)
              })
                .catch((err) => {
                  console.error(err)
                })

              // add resize so its completion will be awaited for
              resizes.push(resize)
            }

            return Promise.all(resizes)
          })
          .then((input) => {
            log.success(shortFile, 'resized')
          })
          .catch((err) => {
            log.error(shortFile, 'not an image')
          })
      })
    })
    .then(() => {
      log.enter().info('Job\'s done!')
      process.exit(0)
    })
    .catch((err) => {
      console.error(err);
      process.exit(1)
    })

}
