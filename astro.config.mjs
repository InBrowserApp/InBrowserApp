// @ts-check
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue(),
    UnoCSS({ injectReset: true })
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@shared': '/shared',
        '@tools': '/tools',
        '@utils': '/utils'
      }
    }
  }
})
