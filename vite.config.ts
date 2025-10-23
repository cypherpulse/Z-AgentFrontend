import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Suppress CSS warnings from dependencies
    cssCodeSplit: true,
  },
  css: {
    // Suppress PostCSS warnings
    postcss: {
      plugins: [],
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  // Suppress build warnings
  logLevel: 'info',
});
