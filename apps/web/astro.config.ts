import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@tools/roman-numeral-converter': fileURLToPath(new URL('../../tools/roman-numeral-converter/src', import.meta.url)),
        '@inbrowserapp/tools': fileURLToPath(new URL('../../packages/tools/src', import.meta.url))
      }
    }
  }
})
