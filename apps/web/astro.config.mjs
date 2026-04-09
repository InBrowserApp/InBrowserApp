// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import { fileURLToPath } from "node:url"

import {
  DEFAULT_SITE_LANGUAGE,
  SUPPORTED_SITE_LANGUAGES,
} from "./src/lib/site.ts"

// https://astro.build/config
export default defineConfig({
  site: "https://inbrowser.app",
  vite: {
    resolve: {
      alias: {
        "node:perf_hooks": fileURLToPath(
          new URL("./src/shims/perf-hooks.ts", import.meta.url)
        ),
      },
    },
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_SITE_LANGUAGE,
        locales: Object.fromEntries(
          SUPPORTED_SITE_LANGUAGES.map((locale) => [locale, locale])
        ),
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
})
