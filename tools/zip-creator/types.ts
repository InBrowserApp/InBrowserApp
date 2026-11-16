import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ZipItem = Readonly<{ path: string; file: File | null }>
// Separate dropped roots can share a name (for example, two search results).
export type InputItem = ZipItem & Readonly<{ root?: number }>
export type Progress = Readonly<{ path: string; percent: number }>
