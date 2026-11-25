import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ErrorCode =
  | "damaged"
  | "protected"
  | "unsupportedLayout"
  | "incomplete"
  | "alreadyKepub"

export class KepubError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code)
  }
}

export type Progress = { current: number; total: number } | "saving"
