export type OutputMode = "preview" | "html"

export type ThemeMode = "light" | "dark"

export type TocItem = Readonly<{
  id: string
  level: number
  text: string
}>

export type MarkdownPreviewerLocalizedCatalog = Readonly<{
  markdownLabel: string
  markdownPlaceholder: string
  previewLabel: string
  htmlSourceLabel: string
  viewModeLabel: string
  themeLabel: string
  sanitizeHtmlLabel: string
  showTocLabel: string
  themeLightLabel: string
  themeDarkLabel: string
  importFromFileLabel: string
  copyHtmlLabel: string
  copiedLabel: string
  downloadHtmlLabel: string
  printHtmlLabel: string
  useSampleLabel: string
  clearTextLabel: string
  tocTitle: string
  tocEmptyLabel: string
  untitledHeading: string
}>

export type MarkdownPreviewerMessages = MarkdownPreviewerLocalizedCatalog &
  Readonly<{
    meta: {
      name: string
      description: string
    }
  }>

export type MarkdownPreviewerStoredState = Readonly<{
  markdown: string
  outputMode: OutputMode
  sanitize: boolean
  showToc: boolean
  theme: ThemeMode
}>
