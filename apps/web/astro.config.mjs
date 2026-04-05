// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://inbrowser.app",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), react()],
})
