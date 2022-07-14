/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import fs from 'fs-extra'
import colors from 'picocolors'
import pkg from '../../package.json'
import { getConfigFileName, getEnvConfig, getRootPath } from '../utils'



interface CreateConfigParams {
  configName: string
  config: any
  configFileName?: string
  outputDir?: string
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, configFileName, outputDir = 'dist' } = params
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')
    fs.mkdirp(getRootPath(outputDir))
    fs.writeFileSync(getRootPath(`${outputDir}/${configFileName}`), configStr)

    console.log(colors.cyan(`✨ [${pkg.name}]`) + ' - configuration file is build successfully:')
    console.log(colors.gray(outputDir + '/' + colors.green(configFileName)) + '\n')
  } catch (error) {
    console.log(colors.red('configuration file configuration file failed to package:\n' + error))
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const appConfig = getEnvConfig('VITE_APP_') as ViteEnv
  const configFileName = getConfigFileName(config)
  createConfig({
    config,
    configName: configFileName,
    configFileName: appConfig.VITE_APP_CONFIG_FILE_NAME,
    outputDir: appConfig.VITE_APP_OUTPUT_DIR
  })
}
