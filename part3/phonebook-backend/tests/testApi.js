import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export const loadApp = () => {
  const appPath = require.resolve('../app')
  delete require.cache[appPath]
  return require('../app')
}
