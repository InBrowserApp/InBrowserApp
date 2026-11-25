// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"

import { isolatedConverter } from "./build/isolated-converter.mjs"

import { gzipAssets } from "./build/gzip-assets.mjs"

const require = createRequire(import.meta.url)
const requireAudioTool = createRequire(
  new URL("../../tools/audio-to-text/package.json", import.meta.url)
)

import {
  DEFAULT_SITE_LANGUAGE,
  SUPPORTED_SITE_LANGUAGES,
} from "./src/lib/site.ts"
import { addXDefaultHreflang } from "./src/lib/sitemap-serialize.ts"

const wordRedirectSlugs = {
  "doc-viewer": "microsoft-word-viewer",
  "docx-viewer": "microsoft-word-viewer",
  "doc-to-pdf-converter": "microsoft-word-to-pdf-converter",
  "docx-to-pdf-converter": "microsoft-word-to-pdf-converter",
}

const wordRedirects = Object.fromEntries(
  SUPPORTED_SITE_LANGUAGES.flatMap((language) => {
    const prefix = language === DEFAULT_SITE_LANGUAGE ? "" : `/${language}`
    return Object.entries(wordRedirectSlugs).map(([oldSlug, newSlug]) => [
      `${prefix}/tools/${oldSlug}/`,
      {
        destination: `${prefix}/tools/${newSlug}/`,
        status: /** @type {const} */ (301),
      },
    ])
  })
)

// https://astro.build/config
export default defineConfig({
  site: "https://inbrowser.app",
  trailingSlash: "always",
  redirects: wordRedirects,
  compressHTML: true,
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  vite: {
    build: {
      rolldownOptions: {
        output: {
          // Initialize the reflection polyfill before shared X.509 modules.
          strictExecutionOrder: true,
        },
      },
    },
    optimizeDeps: { exclude: ["@silurus/ooxml"] },
    resolve: {
      alias: {
        // parse-torrent uses path to join the file path components.
        path: require.resolve("path-browserify"),
        // MSG ANSI decoding uses iconv-lite through these browser packages.
        buffer: require.resolve("buffer/index.js"),
        string_decoder: require.resolve("string_decoder/lib/string_decoder.js"),
        "node:perf_hooks": fileURLToPath(
          new URL("./src/shims/perf-hooks.ts", import.meta.url)
        ),
        // The WebGPU runtime's raw WASM exceeds the static asset size limit.
        // Use its external-WASM entry so the audio worker can load gzip.
        "onnxruntime-web/webgpu": join(
          dirname(requireAudioTool.resolve("onnxruntime-web/webgpu")),
          "ort.webgpu.min.mjs"
        ),
        "@huggingface/transformers/dist": dirname(
          requireAudioTool.resolve("@huggingface/transformers")
        ),
      },
    },
    worker: {
      format: "es",
      plugins: () => [gzipAssets()],
    },
    plugins: [tailwindcss(), gzipAssets(), isolatedConverter()],
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      // Leave headroom under Cloudflare's 25 MiB asset limit for hreflang links.
      entryLimit: 5_000,
      filter: (url) => !Object.hasOwn(wordRedirects, new URL(url).pathname),
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
  experimental: {
    clientPrerender: true,
  },
})
