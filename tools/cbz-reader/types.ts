import type messages from "./messages/en.json"
import type { Messages as ReaderMessages } from "@workspace/ui/comic-reader/types"

export type Messages = typeof messages & ReaderMessages
export type { Comic } from "@workspace/comic/types"
