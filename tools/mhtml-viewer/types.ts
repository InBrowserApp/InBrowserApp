import type { WebDocument } from "@workspace/web-document"
import type { ConvertedArchive } from "@workspace/web-document/archive"
import type en from "./messages/en.json"
export type { Failure } from "@workspace/web-document/archive"

export type Messages = typeof en
export type ArchiveDocument = WebDocument & Omit<ConvertedArchive, "source">
