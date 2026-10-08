import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ReaderState = {
  page: number
  total: number
  zoom: number
  current: number
  matches: number
  searching: boolean
  query: string
}
export type Reader = {
  page: (page: number) => void
  zoom: (scale: number | "page-width") => void
  find: (query: string, previous?: boolean) => void
  dispose: () => void
}
