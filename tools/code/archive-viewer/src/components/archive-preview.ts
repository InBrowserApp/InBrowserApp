import type { ArchiveEntry } from '../types'

export const MAX_TEXT_PREVIEW_BYTES = 1024 * 1024

const TEXT_EXTENSIONS = new Set([
  'txt',
  'md',
  'json',
  'js',
  'ts',
  'tsx',
  'jsx',
  'css',
  'html',
  'xml',
  'yml',
  'yaml',
  'toml',
  'csv',
  'log',
  'ini',
  'conf',
  'plist',
])

const PREVIEW_LANGUAGE_BY_EXTENSION: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  css: 'css',
  html: 'xml',
  xml: 'xml',
  plist: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  json: 'json',
  md: 'markdown',
  py: 'python',
  rb: 'ruby',
  java: 'java',
  kt: 'kotlin',
  go: 'go',
  rs: 'rust',
  php: 'php',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  sql: 'sql',
  toml: 'ini',
  ini: 'ini',
  conf: 'ini',
  txt: 'plaintext',
}

export function isTextEntry(entry: ArchiveEntry, blob: Blob): boolean {
  if (blob.type.startsWith('text/')) return true
  if (blob.type.includes('json') || blob.type.includes('xml') || blob.type.includes('yaml')) {
    return true
  }

  return TEXT_EXTENSIONS.has(entry.extension.toLowerCase())
}

export function isImageEntry(entry: ArchiveEntry, blob: Blob): boolean {
  if (blob.type.startsWith('image/')) return true
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp', 'avif', 'tif', 'tiff'].includes(
    entry.extension.toLowerCase(),
  )
}

export function resolveTextPreviewLanguage(entry: ArchiveEntry, blob: Blob): string {
  const extension = entry.extension.toLowerCase()
  const fromExtension = PREVIEW_LANGUAGE_BY_EXTENSION[extension]
  if (fromExtension) {
    return fromExtension
  }

  const mimeType = blob.type.toLowerCase()
  if (mimeType.includes('json')) return 'json'
  if (mimeType.includes('xml')) return 'xml'
  if (mimeType.includes('yaml')) return 'yaml'
  if (mimeType.includes('javascript')) return 'javascript'
  if (mimeType.includes('typescript')) return 'typescript'
  if (mimeType.includes('html')) return 'xml'
  if (mimeType.includes('css')) return 'css'

  return 'plaintext'
}
