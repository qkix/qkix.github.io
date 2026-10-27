// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static site for GitHub Pages at https://qkix.eu (public/CNAME). Every page is a folder with
// index.html, so the old addresses (/inchway/privacy/, /inchway/test/, /steer-clear/) keep working.
export default defineConfig({
  site: "https://qkix.eu",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap({ filter: (page) => !page.includes("/steer-clear/") })],
});
