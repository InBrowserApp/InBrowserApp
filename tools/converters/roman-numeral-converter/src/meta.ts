import { i18n } from './i18n'
import type { ToolMetadata } from '@inbrowserapp/tools-shared'

export const metadata = {
  id: 'roman-numeral-converter',
  path: '/roman-numeral-converter',
  icon: 'fluent:text-number-format-20-regular',
  tags: ['converters', 'roman', 'numeral', 'number'],
  features: ['offline'],
  i18n,
} as const satisfies ToolMetadata
