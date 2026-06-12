import { generateImportMap } from '../../node_modules/payload/dist/bin/generateImportMap/index.js'

const configModule = await import('../payload.config.js')
const config = configModule.default ?? configModule

await generateImportMap(config, { log: true })
console.log('Import map generated successfully.')
