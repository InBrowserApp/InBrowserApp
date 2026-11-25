import type { ComicArchiveKind } from "../comic-reader/archive-formats"
import type messages from "./messages/en.json"

export type Messages = typeof messages

export type ComicPdfFormat = "cbz" | ComicArchiveKind
