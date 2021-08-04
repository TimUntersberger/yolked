import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import mkcert from "vite-plugin-mkcert"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  build: {
    outDir: "docs",
  },
  base: "/yolked/",
  plugins: [reactRefresh(), mkcert({
    hosts: ["localhost", "www.localhost.com", "localhost.com"]
  })]
})
