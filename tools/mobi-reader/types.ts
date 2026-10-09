import type messages from "./messages/en.json"
import type {
  ContentsItem,
  Destination,
  ReadingBook,
} from "@workspace/ui/lib/book-reader"

export type Messages = typeof messages
export type OpenBook = ReadingBook
export interface MobiBook {
  sections: {
    id?: number
    linear?: string
    load?: () => Promise<string>
  }[]
  toc?: ContentsItem[]
  metadata: { title?: string; author?: string[] }
  rendition?: { layout?: string }
  getCover: () => Promise<Blob | undefined>
  resolveHref: (
    href: string
  ) => Destination | undefined | Promise<Destination | undefined>
  destroy: () => void
}
