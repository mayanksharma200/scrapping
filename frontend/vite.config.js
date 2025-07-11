import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api":
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000"
          : "https://scrapping-production-bf36.up.railway.app",
    },
  },
});
