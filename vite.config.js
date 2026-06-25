import { defineConfig } from "vite";

const allowedHosts = ["ubuntu", ".cpolar.top"];

export default defineConfig({
  server: {
    allowedHosts,
  },
  preview: {
    allowedHosts,
  },
});
