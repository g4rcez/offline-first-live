import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const PWA_CONFIG: Partial<VitePWAOptions> = {
  workbox: { globPatterns: ["**/*"] },
  includeAssets: ["**/*"],
  manifest: {
    theme_color: "#f69435",
    background_color: "#f69435",
    display: "standalone",
    scope: "/",
    start_url: "/",
    short_name: "vite test",
    description: "testing vite pwa",
    name: "vite test",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
} as const;

// https://vite.dev/config/
export default defineConfig({
  plugins: [VitePWA(PWA_CONFIG), react()],
});
