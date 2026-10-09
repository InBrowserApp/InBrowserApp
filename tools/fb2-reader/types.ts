import type messages from "./messages/en.json"
import type { Destination, ReadingBook } from "@workspace/ui/lib/book-reader"
export type Messages = typeof messages
export type OpenBook = ReadingBook
export interface Fb2Book {
  sections: { id: number; linear?: string; load: () => string }[]
  metadata: { title?: string; author?: (string | { name: string })[] }
  resolveHref: (href: string) => Destination
  destroy: () => void
}
