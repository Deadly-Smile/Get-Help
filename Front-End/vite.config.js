import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows access from external devices, including Docker.
    port: 5173, // Optional, ensure it matches the exposed port.
  },
});
