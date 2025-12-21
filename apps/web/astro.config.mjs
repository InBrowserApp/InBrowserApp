// @ts-check
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'
import { fileURLToPath } from 'node:url'

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue(),
    UnoCSS({ injectReset: true })
  ],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@tools/roman-numeral-converter': fileURLToPath(new URL('../../tools/roman-numeral-converter/src', import.meta.url)),
        '@inbrowserapp/tools': fileURLToPath(new URL('../../packages/tools/src', import.meta.url))
      }
    }
  }
})
