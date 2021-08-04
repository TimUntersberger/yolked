import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import mkcert from "vite-plugin-mkcert";
import { VitePWA as pwa } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  base: "/yolked/",
  plugins: [
    reactRefresh(),
    mkcert({
      hosts: ["localhost", "www.localhost.com", "localhost.com"],
    }),
    pwa({
      manifest: {
        name: "Yolked",
        short_name: "Yolked",
        start_url: "/yolked",
        display: "standalone"
      }
    })
  ],
});
