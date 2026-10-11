import type catalog from "./messages/en.json"
import type { TocItem } from "@workspace/markdown"
import type { PreviewTheme } from "@workspace/markdown/types"

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
