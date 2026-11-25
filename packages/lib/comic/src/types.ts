export type PageProblem =
  | "unsupportedPage"
  | "encryptedPage"
  | "damagedPage"
  | "resourceLimit"
export type PageStatus = "unchecked" | "ready" | PageProblem
export type ComicPage = { name: string; status: PageStatus }
export type ComicPreview = {
  total: number
  first: string
  last: string
  cover: Blob | null
}
export type Comic = {
  pages: ComicPage[]
  read: (index: number, signal: AbortSignal) => Promise<Blob>
  dispose: () => Promise<void>
}
