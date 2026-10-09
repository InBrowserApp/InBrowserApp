import type catalog from "./messages/en.json"
import type { TocItem } from "./core/markdown-preview"
import type { PreviewTheme } from "./core/preview-options"

type MarkdownPreviewerLocalizedCatalog = Readonly<typeof catalog>
type MarkdownPreviewerMessages = MarkdownPreviewerLocalizedCatalog &
  Readonly<{
    meta: { name: string; description: string }
  }>
export type {
  MarkdownPreviewerLocalizedCatalog,
  MarkdownPreviewerMessages,
  PreviewTheme,
  TocItem,
}
