import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 等同於 '0.0.0.0'，允許 LAN 存取
    port: 3002, // 設定伺服器埠號,
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  // 新增此行來明確指定 .lottie 檔案為靜態資源
  assetsInclude: ["**/*.lottie"],
});
