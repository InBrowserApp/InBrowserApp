import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ContentsItem = {
  label: string
  href: string
  subitems?: ContentsItem[] | null
}
export type Destination = {
  index: number
  anchor?: (doc: Document) => Element | Range | number | null
}
export interface BookSection {
  id: string
  linear?: string
  load: () => Promise<string | null>
  unload: () => void
  resolveHref: (href: string) => string
}
export interface ParsedBook {
  sections: BookSection[]
  toc?: ContentsItem[]
  metadata: Record<string, unknown>
  rendition: { layout?: string }
  resources: {
    cover?: { href: string; mediaType: string }
    spine: { idref: string; properties?: string[] }[]
    manifest: {
      id: string
      href: string
      mediaType: string
      properties?: string[]
    }[]
  }
  resolveHref: (href: string) => Destination | null
  getCover: () => Promise<Blob | null>
  destroy: () => void
}
export interface OpenBook {
  parsed: ParsedBook
  title: string
  author: string
  cover: string | null
  missing: boolean
  dispose: () => void
}
