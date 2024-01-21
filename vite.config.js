import { defineConfig } from "vite";

// English Documents: https://vitejs.dev/config/
// 漢語檔案： https://cn.vitejs.dev/config/
export default defineConfig({
  base: "/pyanxchet/",
  build: {
    target: "es2022",
    outDir: "Artifacts", // 設置構建輸出目錄為 `./Artifacts/`
  },
});
