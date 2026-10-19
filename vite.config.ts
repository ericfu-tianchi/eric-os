import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // /api/* runs in the Worker: `npx wrangler dev` on :8787 alongside `npm run dev`
  server: { proxy: { "/api": "http://localhost:8787" }, watch: { ignored: ["**/.wrangler/**"] } },
});
