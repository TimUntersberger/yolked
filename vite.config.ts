import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import mkcert from "vite-plugin-mkcert";
import { VitePWA as pwa } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 3000
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
        icons: [
          {
            "src": "assets/yolked.png",
            "type": "image/png",
            "sizes": "180x180",
          },
          {
            "src": "assets/yolked.png",
            "type": "image/png",
            "sizes": "48x48"
          },
          {
            "src": "assets/yolked.png",
            "type": "image/png",
            "sizes": "32x32"
          }
        ],
        short_name: "Yolked",
        start_url: "/yolked",
        display: "standalone"
      }
    })
  ],
});
