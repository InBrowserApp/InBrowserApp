import { type Component, h } from 'vue'
import { NIcon } from 'naive-ui'
import Archive16Regular from '@vicons/fluent/Archive16Regular'
import Code16Regular from '@vicons/fluent/Code16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import DocumentCss20Regular from '@vicons/fluent/DocumentCss20Regular'
import DocumentJavascript20Regular from '@vicons/fluent/DocumentJavascript20Regular'
import DocumentLink16Regular from '@vicons/fluent/DocumentLink16Regular'
import DocumentPdf16Regular from '@vicons/fluent/DocumentPdf16Regular'
import DocumentRibbon16Regular from '@vicons/fluent/DocumentRibbon16Regular'
import DocumentSettings16Regular from '@vicons/fluent/DocumentSettings16Regular'
import DocumentTable16Regular from '@vicons/fluent/DocumentTable16Regular'
import DocumentText20Regular from '@vicons/fluent/DocumentText20Regular'
import Folder16Regular from '@vicons/fluent/Folder16Regular'
import Image16Regular from '@vicons/fluent/Image16Regular'
import MusicNote2Play20Regular from '@vicons/fluent/MusicNote2Play20Regular'
import Video16Regular from '@vicons/fluent/Video16Regular'
import type { ArchiveEntryKind } from '../types'

const IMAGE_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'bmp',
  'avif',
  'ico',
  'tif',
  'tiff',
])
const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'mkv',
  'mov',
  'avi',
  'flv',
  'm4v',
  'mpg',
  'mpeg',
  'ogv',
  '3gp',
  'ts',
])
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'wma'])
const CSS_EXTENSIONS = new Set(['css', 'scss', 'sass', 'less', 'styl', 'stylus'])
const JAVASCRIPT_EXTENSIONS = new Set(['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'])
const LINK_EXTENSIONS = new Set(['url', 'webloc', 'lnk', 'desktop'])
const PDF_EXTENSIONS = new Set(['pdf'])
const RIBBON_EXTENSIONS = new Set(['md', 'markdown', 'doc', 'docx', 'odt', 'rtf'])
const SETTINGS_EXTENSIONS = new Set([
  'conf',
  'config',
  'cfg',
  'ini',
  'env',
  'yaml',
  'yml',
  'toml',
  'properties',
])
const TABLE_EXTENSIONS = new Set(['csv', 'tsv', 'xls', 'xlsx', 'ods'])
const ARCHIVE_EXTENSIONS = new Set(['zip', 'tar', 'gz', 'tgz', 'bz2', 'xz', '7z', 'rar', 'zst'])
const CODE_EXTENSIONS = new Set([
  'c',
  'cc',
  'cpp',
  'cxx',
  'h',
  'hpp',
  'hh',
  'hxx',
  'java',
  'kt',
  'kts',
  'swift',
  'go',
  'rs',
  'py',
  'rb',
  'php',
  'cs',
  'scala',
  'sh',
  'bash',
  'zsh',
  'fish',
  'ps1',
  'bat',
  'cmd',
  'sql',
  'lua',
])
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
])

type ArchiveRowIconInput = {
  name: string
  kind: ArchiveEntryKind
  extension: string
}

export function renderArchiveRowNameCell(row: ArchiveRowIconInput) {
  return h(
    'span',
    {
      style:
        'display:inline-flex;align-items:center;gap:8px;max-width:100%;min-width:0;vertical-align:middle;',
    },
    [
      h(NIcon, { component: resolveRowIcon(row.kind, row.extension), size: 18 }),
      h(
        'span',
        {
          style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
        },
        row.name,
      ),
    ],
  )
}

function resolveRowIcon(kind: ArchiveEntryKind, extensionRaw: string): Component {
  if (kind === 'directory') {
    return Folder16Regular
  }

  if (kind === 'symlink') {
    return DocumentLink16Regular
  }

  const extension = extensionRaw.toLowerCase()

  if (IMAGE_EXTENSIONS.has(extension)) {
    return Image16Regular
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return Video16Regular
  }

  if (AUDIO_EXTENSIONS.has(extension)) {
    return MusicNote2Play20Regular
  }

  if (CSS_EXTENSIONS.has(extension)) {
    return DocumentCss20Regular
  }

  if (JAVASCRIPT_EXTENSIONS.has(extension)) {
    return DocumentJavascript20Regular
  }

  if (PDF_EXTENSIONS.has(extension)) {
    return DocumentPdf16Regular
  }

  if (LINK_EXTENSIONS.has(extension)) {
    return DocumentLink16Regular
  }

  if (TABLE_EXTENSIONS.has(extension)) {
    return DocumentTable16Regular
  }

  if (SETTINGS_EXTENSIONS.has(extension)) {
    return DocumentSettings16Regular
  }

  if (RIBBON_EXTENSIONS.has(extension)) {
    return DocumentRibbon16Regular
  }

  if (ARCHIVE_EXTENSIONS.has(extension)) {
    return Archive16Regular
  }

  if (CODE_EXTENSIONS.has(extension)) {
    return Code16Regular
  }

  if (TEXT_EXTENSIONS.has(extension)) {
    return DocumentText20Regular
  }

  return Document16Regular
}
