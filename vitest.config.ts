import { fileURLToPath, URL } from 'node:url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'node:perf_hooks': fileURLToPath(
        new URL('./apps/web/src/shims/perf-hooks.ts', import.meta.url),
      ),
    },
  },
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
          setupFiles: ['./vitest.setup.ts'],
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
