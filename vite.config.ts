import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
import viteCompression from 'vite-plugin-compression'
// import eslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: '@import "@/style/home.scss";',
        themen: '@import "@/style/_theme.scss";',
        // handle: '@import "@/style/_handle.scss;"'
      }
    }
  },
  plugins: [
    vue(),
    // eslintPlugin({
    //   include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
    // }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteCompression({
      verbose: true,
      disable: false, // 开启压缩（不禁用）
      deleteOriginFile: false, // 删除源文件
      threshold: 10240, // 压缩前最新文件大小
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 文件类型
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    // alias: {
    //   '@': path.resolve(__dirname, './src'),
    //   // 其他别名
    // }
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
    },
    sourcemap: true
  },
  server: {
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true
      }
    }
  }
})
