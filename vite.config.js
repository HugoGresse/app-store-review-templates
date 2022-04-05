import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "@samrum/vite-plugin-web-extension";
import { readFileSync } from "fs";
import { ManifestV2, ManifestV3 } from "./src/manifest.js";
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const configEnv = loadEnv(mode, process.cwd(), "");

  const manifest = configEnv.MANIFEST_VERSION === "3" ? ManifestV3 : ManifestV2;

  return {
    plugins: [
      svelte(),
      webExtension({
        manifest: {
          author: pkg.author,
          description: pkg.description,
          name: pkg.displayName ?? pkg.name,
          version: pkg.version,
          ...manifest,
        },
      }),
    ],
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
      },
    },
  };
});
