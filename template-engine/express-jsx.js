const fs = require('fs')
const getKeyFromOptions = (options) => {
  const { settings, _locals, ...objectKeys } = options
  console.log('objectKeys ::', objectKeys)
  return Object.keys(objectKeys)
}

const getRenderedContent = (content, options) => {
  const keys = getKeyFromOptions(options)
  let contentString = content.toString()

  for (let key of keys) {
    contentString = contentString.replace(
      new RegExp(`\{${key}\}`, 'gi'),
      options[key]
    )
  }

  return contentString
}

const expressJSX = (filepath, options, callback) => {
  fs.readFile(filepath, (error, content) => {
    if (error) return callback(error)

    const rendered = getRenderedContent(content, options)

    return callback(null, rendered)
  })
}

module.exports = expressJSX