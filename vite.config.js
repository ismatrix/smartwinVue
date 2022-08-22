import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path-browserify"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // path: "path-browserify",
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    }
  },
  server: {
    host: '0.0.0.0',
  },
})

