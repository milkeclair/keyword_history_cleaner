import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Keyword History Cleaner",
  description: "chromeの検索履歴をキーワード検索で削除する",
  version: "1.0.0",
  permissions: ["history"],
  action: {
    default_popup: "popup.html",
  },
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    hmr: {
      port: 3000,
    },
  },
});
