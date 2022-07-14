import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import dayjs from "dayjs";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteMockServe } from "vite-plugin-mock";
import { configCompressPlugin } from "./build/compress";
import { configImageminPlugin } from "./build/imagemin";
import { createProxy } from "./build/proxy";
import { configPwaConfig } from "./build/pwa";
import { wrapperEnv } from "./build/utils";
import pkg from "./package.json";

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

// 设置应用信息
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // loadEnv读取的布尔类型是一个字符串。这个函数可以转换为布尔类型
  const viteEnv = wrapperEnv(env);

  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_PROXY,
    VITE_DROP_CONSOLE,
    VITE_HTTPS,
    VITE_USE_MOCK,
    VITE_GLOB_APP_TITLE,
    VITE_APP_CONFIG_FILE_NAME,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_IMAGEMIN,
    VITE_LEGACY,
  } = viteEnv;
  const isBuild = command === "build";
  const lifecycle = process.env.npm_lifecycle_event;

  const path = VITE_PUBLIC_PATH.endsWith("/") ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;
  const getAppConfigSrc = () => {
    return `${path || "/"}${VITE_APP_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const buildPlugins = isBuild
    ? [
        // gzip,brotli压缩输出，生产有效
        configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
        // 图片压缩
        VITE_USE_IMAGEMIN && configImageminPlugin(),
        // pwd应用
        configPwaConfig(viteEnv),
        // 浏览器兼容
        VITE_LEGACY && legacy(),
      ]
    : [];

  return {
    base: VITE_PUBLIC_PATH,
    root,
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
    },
    resolve: {
      alias: {
        "@": pathResolve("src"),
        types: pathResolve("types"),
        path: "path-browserify",
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: { "@primary-color": "#13c2c2" },
        },
        // ....
      },
    },

    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    server: {
      https: VITE_HTTPS,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
    },
    plugins: [
      react(),
      viteMockServe({
        // eslint-disable-next-line no-useless-escape
        ignore: /^\_/,
        mockPath: "mock",
        supportTs: true,
        prodEnabled: VITE_USE_MOCK,
        // 相当于在src/main.ts中inject下面的代码，所以注意文件的路径问题
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `,
      }),
      // html定制化
      createHtmlPlugin({
        minify: isBuild,
        inject: {
          // Inject data into ejs template
          data: {
            title: VITE_GLOB_APP_TITLE,
          },
          // Embed the generated _app.config.js file, 使用esno编译，npm run build:post
          tags: isBuild
            ? [
                {
                  tag: "script",
                  attrs: {
                    src: getAppConfigSrc(),
                  },
                },
              ]
            : [],
        },
      }),
      ...buildPlugins,
      // 打包分析
      lifecycle === "report" &&
        visualizer({
          filename: "./node_modules/.cache/visualizer/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
    ],
  };
});
