import type messages from "./messages/en.json"
import type { CellDetails } from "./core/cells"
export type Messages = typeof messages
export type ReaderState = {
  sheet: number
  sheets: { name: string; hidden: boolean }[]
  zoom: number
  selection: CellDetails | null
  empty: boolean
  switching: boolean
  copyStatus: "" | "copied" | "failed"
}
export type Reader = {
  sheet: (index: number) => void
  zoom: (value: number | "page-width") => void
  go: (reference: string) => void
  copy: () => void
  dispose: () => void
}
