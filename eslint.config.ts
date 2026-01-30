import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import inbrowserI18n from './eslint/inbrowser-i18n'
import { supportedLanguages } from './shared/locale/src/languages'

const noRawTextIgnorePattern = [
  '[\\s#%/\\-:().,_=]+',
  '[A-Z0-9][A-Z0-9 vV./_\\-=:]*',
  'https?://\\S+',
  '[a-z0-9.-]+\\.[a-z]{2,}',
  '<[^>]+>',
  '[0-9]+x',
  '[0-9]+-bit',
].join('|')
const supportedLocales = [...supportedLanguages]

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(vueI18n.configs.recommended as unknown as any),
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
      '@intlify/vue-i18n/no-deprecated-i18n-component': 'error',
      '@intlify/vue-i18n/no-deprecated-i18n-place-attr': 'error',
      '@intlify/vue-i18n/no-deprecated-i18n-places-prop': 'error',
      '@intlify/vue-i18n/no-deprecated-modulo-syntax': 'error',
      '@intlify/vue-i18n/no-deprecated-tc': 'error',
      '@intlify/vue-i18n/no-deprecated-v-t': 'error',
      '@intlify/vue-i18n/no-html-messages': 'error',
      '@intlify/vue-i18n/no-i18n-t-path-prop': 'error',
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          ignorePattern: `^(?:${noRawTextIgnorePattern})$`,
          ignoreText: ['Base64', 'GitHub', 'Hex', 'InBrowser.App', 'x'],
        },
      ],
      '@intlify/vue-i18n/no-v-html': 'error',
      '@intlify/vue-i18n/valid-message-syntax': 'error',
      '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
      '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
      '@intlify/vue-i18n/no-unknown-locale': [
        'error',
        {
          locales: supportedLocales,
          disableRFC5646: true,
        },
      ],
      '@intlify/vue-i18n/prefer-sfc-lang-attr': 'error',
      '@intlify/vue-i18n/no-dynamic-keys': 'error',
      '@intlify/vue-i18n/no-unused-keys': 'error',
    },
  },
  {
    name: 'app/max-lines',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    name: 'app/max-lines-tests',
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'max-lines': 'off',
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
