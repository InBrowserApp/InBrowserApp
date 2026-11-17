import type catalog from "./messages/en.json"
export type Messages = { [Key in keyof typeof catalog]: string }
