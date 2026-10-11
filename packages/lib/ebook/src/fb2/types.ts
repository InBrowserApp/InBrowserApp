import type { Destination, ReadingBook } from "../types"
export type OpenBook = ReadingBook
export interface Fb2Book {
  sections: { id: number; linear?: string; load: () => string }[]
  metadata: { title?: string; author?: (string | { name: string })[] }
  resolveHref: (href: string) => Destination
  destroy: () => void
}
