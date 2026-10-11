export type ContentsItem = {
  label: string
  href: string
  subitems?: ContentsItem[] | null
}
export type Destination = {
  index: number
  anchor?: (doc: Document) => Element | Range | number | null
}
export type BookSection = {
  id: string
  linear?: string
  navigation?: boolean
  load: () => Promise<string | null>
  unload?: () => void
  resolveHref?: (href: string) => string
}
export type ReadingBook = {
  parsed: {
    sections: BookSection[]
    toc?: ContentsItem[]
    resolveHref: (
      href: string
    ) => Destination | null | Promise<Destination | null>
  }
  title: string
  author: string
  description?: string
  cover: string | null
  missing: boolean
  incomplete?: boolean
  dispose: () => void
}
