import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        market: resolve(__dirname, "market-place.html"),
        selling: resolve(__dirname, "sellingpage.html"),
        listing: resolve(__dirname, "listing.html"),
      },
    },
  },
});
