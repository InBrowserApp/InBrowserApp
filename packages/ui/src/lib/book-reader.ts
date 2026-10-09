export type ContentsItem = {
  label: string
  href: string
  subitems?: ContentsItem[] | null
}
export type Destination = {
  index: number
  anchor?: (doc: Document) => Element | Range | number | null
}
export interface ReadingSection {
  id: string
  linear?: string
  load: () => Promise<string | null>
  unload?: () => void
  resolveHref?: (href: string) => string
}
export interface ReadingBook {
  parsed: {
    sections: ReadingSection[]
    toc?: ContentsItem[]
    resolveHref: (
      href: string
    ) => Destination | null | Promise<Destination | null>
  }
  title: string
  author: string
  cover: string | null
  missing: boolean
  dispose: () => void
}
export type BookReaderMessages = Record<
  | "contents"
  | "closeContents"
  | "previous"
  | "next"
  | "chapter"
  | "chapterCount"
  | "chapterFallback"
  | "smallerText"
  | "largerText"
  | "textSize"
  | "readingWidth"
  | "cover"
  | "reader"
  | "loadingChapter"
  | "chapterError"
  | "resourceLimit"
  | "blockedLink"
  | "missingContent"
  | "limitedContent",
  string
>
