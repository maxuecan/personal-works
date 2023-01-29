import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
const pathResolve = (dir: string) => path.resolve(__dirname, dir)

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: { // 配置别名
    alias: {
      "@": pathResolve('./src'),
    }
  },
  build: { // 打包配置
    target: 'es2015', // 主要用于兼容低版本浏览器 可以解决chrome65版本打包发布到服务器上页面空白的问题(主要是65版本不兼容 try catch )
    // cssTarget: 'chrom65', // 兼容低版本浏览器上样式问题
    assetsDir: './assets', // 打包配置路径
    rollupOptions: {
      input: { // 主要用于配置多页面
        platForm: path.resolve(__dirname, 'index.html')
        // merchant: path.resolve(__dirname, 'merchant.html')
      }
    }
  },
  server: {
    host: true,
    open: true,
  }
})
