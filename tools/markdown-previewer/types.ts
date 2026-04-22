import type { PreviewStats, TocItem } from "./core/markdown-preview"
import type { PreviewMode, PreviewTheme } from "./core/preview-options"

type MarkdownPreviewerLocalizedCatalog = Readonly<{
  editorTitle: string
  editorDescription: string
  sourceLabel: string
  sourcePlaceholder: string
  importLabel: string
  loadSampleLabel: string
  clearLabel: string
  previewTitle: string
  previewDescription: string
  splitViewLabel: string
  previewOnlyLabel: string
  paperThemeLabel: string
  slateThemeLabel: string
  sanitizeHtmlLabel: string
  showOutlineLabel: string
  wordsLabel: string
  headingsLabel: string
  linksLabel: string
  imagesLabel: string
  readTimeLabel: string
  outlineTitle: string
  outlineDescription: string
  outlineEmptyTitle: string
  outlineEmptyDescription: string
  previewEmptyTitle: string
  previewEmptyDescription: string
  copyHtmlLabel: string
  copiedLabel: string
  downloadHtmlLabel: string
  printLabel: string
  untitledHeadingLabel: string
}>

type MarkdownPreviewerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  MarkdownPreviewerLocalizedCatalog

type PreviewBadge = Readonly<{
  key: keyof PreviewStats
  label: string
  value: number
}>

export type {
  MarkdownPreviewerLocalizedCatalog,
  MarkdownPreviewerMessages,
  PreviewBadge,
  PreviewMode,
  PreviewTheme,
  TocItem,
}
