// @flow

import xml2js from 'xml2js'

export * from './prepare-response'
export * from './make-request'

const parserOptions = {
  explicitArray: false,
  attrkey: 'attr',
  valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
  // ignoreAttrs: true,
  // mergeAttrs: true,
}

export const xmlToJSON = (text: string) => new Promise((resolve, reject) => {
  xml2js.parseString(text, parserOptions, (err, json) => {
    if (err) { return reject(err) }
    resolve(json)
  })
})
