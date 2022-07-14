  declare type Recordable<T = any> = Record<string, T>

  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  declare interface ViteEnv {
    VITE_PORT: number
    VITE_USE_MOCK: boolean
    VITE_USE_PWA: boolean
    VITE_PUBLIC_PATH: string
    VITE_PROXY: [string, string][]
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_GLOB_CONFIG_FILE_NAME: string
    VITE_GLOB_API_URL: string
    VITE_DROP_CONSOLE: boolean
    VITE_HTTPS: boolean
    VITE_LEGACY: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_USE_IMAGEMIN: boolean
    VITE_GENERATE_UI: string
    VITE_APP_CONFIG_FILE_NAME: string
    VITE_APP_OUTPUT_DIR: string
  }
