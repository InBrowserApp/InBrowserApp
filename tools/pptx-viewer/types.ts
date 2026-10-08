import type messages from "./messages/en.json"
import type {
  DocumentReaderState,
  DocumentControls,
} from "@workspace/ui/components/tool/document-toolbar"
export type Messages = typeof messages
export type ReaderState = DocumentReaderState
export type Reader = DocumentControls & {
  dispose: () => void
  thumbnail: (canvas: HTMLCanvasElement, page: number) => Promise<void>
}
