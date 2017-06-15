const Promise = require('bluebird')
const fs = require('fs')
Promise.promisifyAll(fs)
const path = require('path')
const handlebars = require('handlebars')
const settings = require('../lib/settings')
const findFiles = require('../lib/findFiles')

module.exports.command = 'generate-html'
module.exports.desc = 'fill a template with images'
module.exports.handler = (argv) => {
  const templateSource = path.join(settings.templateDir, settings.templateDefault)

  let useFiles = settings.inputDir
  // limit files
  if (argv._[1]) {
    useFiles = path.join(settings.inputDir, argv._[1])
  }

  // tasks
  const readTemplateSource = fs.readFileAsync(templateSource, 'utf8')
  const findInputFiles = findFiles(useFiles)

  Promise
    .join(readTemplateSource, findInputFiles)
    .then((results) => {
      // compile template
      const template = handlebars.compile(results[0])

      // build context
      let context = {
        images: []
      }

      for (const file of results[1]) {
        let image = {
          url: {
            remote: {},
            local: {}
          }
        }

        let pathParts = path.parse(file)

        image.file = pathParts.base
        image.ext = pathParts.ext
        image.filename = pathParts.name
        image.name = image.filename.replace(/_/g, ' ')

        const fileRelativeToInput = path.relative(settings.inputDir, file)

        image.url.local.full = file
        if (settings.inputDir.match('^' + settings.outputDir)) {
          // input dir is in output dir -> input dir is in remote
          const fileRelativeToOutput = path.relative(settings.outputDir, file)
          image.url.remote.full = path.join(settings.remoteDir, fileRelativeToOutput)
        }

        for (const size of settings.sizes) {
          image.url.local[size] = path.join(settings.outputDir, String(size), fileRelativeToInput)
          image.url.remote[size] = path.join(settings.remoteDir, String(size), fileRelativeToInput)
        }

        context.images.push(image)
      }

      let excerpt = template(context)

      console.log(excerpt)

      process.exit(0)
    })
}
