import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html', 'clover'],
      include: ['tools/**/*.{vue,ts}'],
      exclude: ['**/*.test.ts', '**/*.dom.test.ts'],
    },
    projects: [
      {
        plugins: [vue(), VueI18nPlugin({})],
        test: {
          name: 'dom',
          include: ['{apps,tools,shared,utils}/**/*.dom.test.ts'],
          environment: 'happy-dom',
          retry: 2,
          typecheck: {
            enabled: true,
            checker: 'vue-tsc',
          },
        },
      },
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/e2e/**',
    ],
  },
  cacheDir: './node_modules/.cache/vitest',
})
