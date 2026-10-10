import type messages from "./messages/en.json"
import type {
  DocumentReaderState,
  DocumentControls,
} from "@workspace/ui/components/tool/document-toolbar"
export type Messages = typeof messages
export type ReaderState = DocumentReaderState
import type { Labels, Result } from "@workspace/docx-markdown/types"
export type Reader = DocumentControls & {
  dispose: () => void
  exportMarkdown: (labels: Labels, signal: AbortSignal) => Promise<Result>
}
