export type Messages = typeof import("./messages/en.json")

export type BookDetails = {
  title: string
  authors: string
  language: string
  publisher: string
  subjects: string
  description: string
}

export type CoverType = "image/jpeg" | "image/png"

export type EpubBook = {
  details: BookDetails
  cover: Blob | null
  coverType: string | null
}
