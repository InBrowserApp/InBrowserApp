import type messages from "./messages/en.json"

export type Messages = typeof messages
export type PageProblem =
  | "unsupportedPage"
  | "encryptedPage"
  | "damagedPage"
  | "resourceLimit"
export type PageStatus = "unchecked" | "ready" | PageProblem
export type ComicPage = { name: string; status: PageStatus }
export type Comic = {
  pages: ComicPage[]
  read: (index: number, signal: AbortSignal) => Promise<Blob>
  dispose: () => Promise<void>
}
export type LoadedImage = { url: string; width: number; height: number }
export type Fit = "page" | "width" | number
