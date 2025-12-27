import type { SupportedLanguage } from './languages'
import type { ToolMetadata, ToolMeta } from '../types/tool'

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

export function translateMeta(
  tool: ToolMetadata,
  lang: SupportedLanguage
): ToolMeta & { name: string; description: string } {
  const meta = tool.meta[lang] || tool.meta.en
  const global = getMessages(lang)

  return {
    name: meta.name,
    description: meta.description,
    ui: {
      ...global,
      ...meta.ui,
    },
  }
}
