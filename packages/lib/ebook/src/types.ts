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
  language?: string
  cover: string | null
  missing: boolean
  incomplete?: boolean
  dispose: () => void
}

export type BookSnapshot = {
  contents?: ContentsItem[]
  title: string
  author: string
  description?: string
  language?: string
  chapters: { id: string; title: string; html: string; supporting: boolean }[]
  cover: string | null
  missing: boolean
  unresolved: boolean
}
