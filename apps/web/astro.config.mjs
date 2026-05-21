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
import { addXDefaultHreflang } from "./src/lib/sitemap-serialize.ts"

// https://astro.build/config
export default defineConfig({
  site: "https://inbrowser.app",
  build: {
    format: "file",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        "node:perf_hooks": fileURLToPath(
          new URL("./src/shims/perf-hooks.ts", import.meta.url)
        ),
      },
    },
    worker: {
      format: "es",
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
      serialize: addXDefaultHreflang,
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
})
