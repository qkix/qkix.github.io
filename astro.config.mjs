// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static site for GitHub Pages at https://qkix.eu (public/CNAME). Every page is a folder with
// index.html, so the old addresses (/inchway/privacy/, /inchway/test/, /steer-clear/) keep working.
export default defineConfig({
  site: "https://qkix.eu",
  trailingSlash: "always",
  build: { format: "directory" },
  // the sitemap: real pages only - not the old game addresses (they forward, or the old privacy copy) nor /g/ /sp/ aliases
  integrations: [sitemap({ filter: (page) => {
    const p = new URL(page).pathname.replace(/^\/pl\//, "/");
    if (p.includes("/steer-clear/") || p.startsWith("/g/") || p.startsWith("/sp/")) return false;
    return p === "/" || p === "/privacy-policy/" || p.startsWith("/games/") || p.startsWith("/strapi-plugins/");
  } })],
});
