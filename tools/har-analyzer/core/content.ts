import type { Body } from "../types"

export const PREVIEW_LIMIT = 100_000

export function bodyPreview(body: Body) {
  if (body.text === null)
    return { text: "", state: "missing", truncated: false } as const
  if (body.text === "")
    return { text: "", state: "empty", truncated: false } as const
  let value = body.text
  const encoded = body.encoding !== ""
  if (
    !encoded &&
    value.length <= PREVIEW_LIMIT &&
    /json/i.test(body.mimeType)
  ) {
    try {
      value = JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      // Some captures contain incomplete JSON. Preserve the original text.
    }
  }
  return {
    text: value.slice(0, PREVIEW_LIMIT),
    state: encoded ? "encoded" : "text",
    truncated: value.length > PREVIEW_LIMIT,
  } as const
}
