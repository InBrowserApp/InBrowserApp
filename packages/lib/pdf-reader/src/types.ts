export type ReaderState = {
  page: number
  total: number
  zoom: number
  current: number
  matches: number
  searching: boolean
  query: string
}
export type OutlineItem = {
  title: string
  destination: string | unknown[] | null
  children: OutlineItem[]
}
export type Reader = {
  page: (page: number) => void
  zoom: (scale: number | "page-width" | "page-fit") => void
  find: (query: string, previous?: boolean) => void
  rotate: () => void
  outline: () => Promise<OutlineItem[]>
  destination: (destination: string | unknown[]) => void
  thumbnail: (
    page: number,
    canvas: HTMLCanvasElement,
    signal: AbortSignal
  ) => Promise<void>
  dispose: () => void
}
