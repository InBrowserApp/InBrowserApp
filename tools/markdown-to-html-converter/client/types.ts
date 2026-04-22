import type { TextMetrics } from "../core/markdown"

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
  resetLabel: string
  outputLabel: string
  outputDescription: string
  sanitizeLabel: string
  sanitizeDescription: string
  previewLabel: string
  previewDescription: string
  sourceLabel: string
  sourceDescription: string
  emptyTitle: string
  emptyDescription: string
  charactersLabel: string
  linesLabel: string
  copyHtmlLabel: string
  copiedLabel: string
  downloadHtmlLabel: string
  printHtmlLabel: string
}>

type MetricsProps = Readonly<{
  messages: MarkdownToHtmlMessages
  metrics: TextMetrics
}>

export type { MarkdownToHtmlMessages, MetricsProps }
