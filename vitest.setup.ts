import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// Create a minimal i18n instance for tests
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

// Configure global plugins for all component tests
config.global.plugins = [i18n]
