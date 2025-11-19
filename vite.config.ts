import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Note: during development you can either use an explicit VITE_BASE_URL
  // pointing at the backend (so the browser calls port 5000 directly),
  // or rely on the dev-server proxy which forwards /api requests to the
  // backend. To make requests go directly to port 5000 (and show 5000 in
  // DevTools), keep VITE_BASE_URL set to "http://localhost:5000" in
  // `.env` and remove the proxy block below.
});
