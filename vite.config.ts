import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true, // 启动开发服务器时自动打开浏览器
  },
  preview: {
    open: true, // 预览时自动打开浏览器
  },
})