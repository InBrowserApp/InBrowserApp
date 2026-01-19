import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import inbrowserI18n from './eslint/inbrowser-i18n'

const noRawTextIgnorePattern = [
  '[\\s#%/\\-:().,_=]+',
  '[A-Z0-9][A-Z0-9 vV./_\\-=:]*',
  '[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}',
  'x{8}-x{4}-[0-9a-fx]{4}-[0-9a-fxy]{4}-x{12}',
  'https?://\\S+',
  '[a-z0-9.-]+\\.[a-z]{2,}',
  '<[^>]+>',
  '"[^"]+": "[^"]+"',
  '[0-9]+x',
  '[0-9]+-bit',
  '\\s*ms\\b.*',
  '\\([rwx]\\)',
].join('|')

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...vueI18n.configs.recommended,
  {
    name: 'app/vue-i18n-settings',
    settings: {
      'vue-i18n': {
        localeDir: 'shared/locale/src/locales/*.{json,json5,yaml,yml}',
        messageSyntaxVersion: '^11.0.0',
      },
    },
  },
  {
    rules: {
      'vue/no-undef-components': [
        'error',
        {
          ignorePatterns: ['router-link', 'router-view', 'i18n-t'],
        },
      ],
      '@intlify/vue-i18n/no-raw-text': [
        'warn',
        {
          ignorePattern: `^(?:${noRawTextIgnorePattern})$`,
          ignoreText: [
            'Base64',
            'Ed25519',
            'GitHub',
            'Google Maps',
            'Google Search Result',
            'Hello',
            'Hex',
            'InBrowser.App',
            'iOS Web Clip',
            'Max UUID',
            'Nil UUID',
            'Raw',
            'Uryyb',
            'WebP',
            'chmod 755 script.sh',
            'x',
          ],
        },
      ],
    },
  },
  {
    name: 'app/vue-i18n-dynamic-meta',
    files: ['shared/ui/src/components/tool/grid/ToolThing.vue'],
    rules: {
      '@intlify/vue-i18n/no-missing-keys': 'off',
    },
  },
  {
    name: 'app/i18n-info',
    files: ['tools/**/src/info.ts'],
    plugins: {
      inbrowser: inbrowserI18n,
    },
    rules: {
      'inbrowser/i18n-info-meta-complete': 'error',
    },
  },
  {
    name: 'app/i18n-vue',
    files: ['**/*.vue'],
    plugins: {
      inbrowser: inbrowserI18n,
    },
    rules: {
      'inbrowser/i18n-vue-block-complete': 'error',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
)
