import type messages from "./messages/en.json"
export type Messages = typeof messages
export type OpenBook = Awaited<
  ReturnType<typeof import("@workspace/ebook/fb2").openBook>
>
