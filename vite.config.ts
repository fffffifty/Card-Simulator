import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Card-Simulator/',
  plugins: [react()],
  // 路径别名配置（解决TS路径提示问题，需配合tsconfig.json）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 把 @ 指向 src 目录
    },
  },
  // LESS 全局变量配置（可选，比如全局主题色）
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/variables.less";`, // 全局导入LESS变量
        javascriptEnabled: true,
      },
    },
  },
  // 开发服务器配置
  server: {
    port: 3000, // 启动端口
    // open: true, // 自动打开浏览器
    // proxy: { // 接口代理（解决跨域）
    //   '/api': {
    //     target: 'http://localhost:8080', // 后端接口地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 去掉/api前缀
    //   },
    // },
  },
})
