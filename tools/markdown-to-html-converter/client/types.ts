type MarkdownToHtmlMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  markdownLabel: string
  markdownDescription: string
  markdownPlaceholder: string
  importFromFileLabel: string
  loadSampleLabel: string
  sampleMarkdown: string
  resetLabel: string
  outputLabel: string
  outputDescription: string
  sanitizeLabel: string
  sanitizeDescription: string
  previewLabel: string
  previewDescription: string
  emptyTitle: string
  emptyDescription: string
  charactersLabel: string
  linesLabel: string
  copyHtmlLabel: string
  copiedLabel: string
  downloadHtmlLabel: string
  printHtmlLabel: string
}>

type MetricLabels = Readonly<{
  characters: string
  lines: string
  nonEmptyLines: string
}>

type MetricsProps = Readonly<{
  messages: MarkdownToHtmlMessages
  metrics: MetricLabels
}>

export type { MarkdownToHtmlMessages, MetricLabels, MetricsProps }
