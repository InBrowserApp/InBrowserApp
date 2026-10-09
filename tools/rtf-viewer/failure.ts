import type { Messages } from "./types"

export function failure(error: unknown, m: Messages) {
  const message = error instanceof Error ? error.message : String(error)
  if (message === "empty") return m.empty
  if (
    /memory|allocation|addressable|decoded image budget|array buffer|unreachable/i.test(
      message
    )
  )
    return m.resourceLimit
  return m.invalid
}
