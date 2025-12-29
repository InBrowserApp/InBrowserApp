import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json', 'html', 'clover'],
      include: ['apps/**/*.ts', 'apps/**/*.vue', 'tools/**/*.ts', 'tools/**/*.vue', 'shared/**/*.ts', 'shared/**/*.vue', 'utils/**/*.ts'],
    },
    projects: [
      {
        plugins: [vue() as Plugin, VueI18nPlugin({}) as Plugin],
        test: {
          name: 'dom',
          include: ['apps/**/*.test.ts', 'tools/**/*.test.ts', 'shared/**/*.test.ts', 'utils/**/*.test.ts'],
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
