import type { SupportedLanguage, ToolMetadata, ToolI18n } from '@inbrowserapp/tools-shared'

export { supportedLanguages } from './languages'
export type { SupportedLanguage } from './languages'

// Global messages (common UI strings shared across all tools)
const globalMessages: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    copy: 'Copy',
    download: 'Download',
    upload: 'Upload',
    clear: 'Clear',
    generate: 'Generate',
    import: 'Import from file',
    export: 'Export to file',
  },
  zh: {
    copy: '复制',
    download: '下载',
    upload: '上传',
    clear: '清除',
    generate: '生成',
    import: '从文件导入',
    export: '导出到文件',
  },
  // Add other languages as needed
} as any

export function getMessages(lang: SupportedLanguage): Record<string, string> {
  return globalMessages[lang] || globalMessages.en
}

export function translateMeta(tool: ToolMetadata, lang: SupportedLanguage): ToolI18n {
  const i18n = tool.i18n[lang] || tool.i18n.en
  const global = getMessages(lang)

  return {
    ...global,
    ...i18n,
  }
}
