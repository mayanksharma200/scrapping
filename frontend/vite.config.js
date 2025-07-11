import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api":
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000"
          : "https://scrapping-production-bf36.up.railway.app",
    },
  },
});
