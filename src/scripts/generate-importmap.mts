import { generateImportMap } from '../../node_modules/payload/dist/bin/generateImportMap/index.js'

const configModule = await import('../payload.config.js')
let config = await configModule
if (config.default) {
  config = await config.default
}

await generateImportMap(config, { log: true })
console.log('Import map generated successfully.')
