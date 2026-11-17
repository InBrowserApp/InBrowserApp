import type { Body } from "../types"

export const PREVIEW_LIMIT = 100_000

export function bodyPreview(body: Body) {
  if (body.text === null)
    return { text: "", state: "missing", truncated: false } as const
  if (body.text === "")
    return { text: "", state: "empty", truncated: false } as const
  return {
    text: body.text.slice(0, PREVIEW_LIMIT),
    state: body.encoding !== "" ? "encoded" : "text",
    truncated: body.text.length > PREVIEW_LIMIT,
  } as const
}
