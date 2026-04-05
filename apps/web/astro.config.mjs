// @ts-check

import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://inbrowser.app",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: `${fileURLToPath(new URL("./src/", import.meta.url))}/`,
        },
        {
          find: "@workspace/tool-sdk",
          replacement: fileURLToPath(
            new URL("../../packages/tool-sdk/src/index.ts", import.meta.url)
          ),
        },
        {
          find: "@workspace/ui/components",
          replacement: fileURLToPath(
            new URL("../../packages/ui/src/components", import.meta.url)
          ),
        },
        {
          find: "@workspace/ui/lib",
          replacement: fileURLToPath(
            new URL("../../packages/ui/src/lib", import.meta.url)
          ),
        },
        {
          find: "@workspace/ui/icons",
          replacement: fileURLToPath(
            new URL("../../packages/ui/src/icons/index.ts", import.meta.url)
          ),
        },
      ],
    },
  },
  integrations: [mdx(), react()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
})
