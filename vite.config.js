import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "jensen-fw",
    project: "happy-chat"
  }), sentryVitePlugin({
    org: "jensen-fq",
    project: "happy-chat"
  }), sentryVitePlugin({
    org: "school-0fs",
    project: "happy-chat"
  }), sentryVitePlugin({
    org: "jensen-yrkeshogskola-13",
    project: "javascript-react"
  })],

  build: {
    sourcemap: true
  }
});