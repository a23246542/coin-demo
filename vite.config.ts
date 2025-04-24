import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 等同於 '0.0.0.0'，允許 LAN 存取
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});
