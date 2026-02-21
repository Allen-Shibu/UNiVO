import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  plugins: [
    {
      name: "rewrite-root",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            req.url = "/src/auth/index.html";
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/auth/index.html"),
        login: resolve(__dirname, "src/auth/login.html"),
        market: resolve(__dirname, "src/marketplace/market-place.html"),
        selling: resolve(__dirname, "src/selling/sellingpage.html"),
        listing: resolve(__dirname, "src/listing/listing.html"),
        wishlist: resolve(__dirname, "src/wishlist/wishlist.html"),
        contact: resolve(__dirname, "src/contact/contact.html"),
        forum: resolve(__dirname, "src/forum/forum.html"),
        notifications: resolve(__dirname, "src/shared/notifications.html"),
        sidebar_header: resolve(__dirname, "src/shared/main.html"),
        loader: resolve(__dirname, "src/shared/loading.html"),
      },
    },
  },
});
