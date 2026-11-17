import { expect, it } from "vitest"
import { bodyPreview, PREVIEW_LIMIT } from "./content"
import type { Body } from "../types"
const body = (
  text: string | null,
  mimeType = "text/plain",
  encoding = ""
): Body => ({ text, mimeType, encoding, params: [] })

it("distinguishes missing and empty captured bodies", () => {
  expect(bodyPreview(body(null))).toEqual({
    text: "",
    state: "missing",
    truncated: false,
  })
  expect(bodyPreview(body(""))).toEqual({
    text: "",
    state: "empty",
    truncated: false,
  })
})
it("preserves JSON, invalid JSON, plain text, and encoded content", () => {
  expect(bodyPreview(body('{"ok":true}', "application/json")).text).toBe(
    '{"ok":true}'
  )
  expect(bodyPreview(body("{", "application/json")).text).toBe("{")
  expect(bodyPreview(body("<script>alert(1)</script>")).text).toBe(
    "<script>alert(1)</script>"
  )
  expect(bodyPreview(body("e30=", "application/json", "base64"))).toEqual({
    text: "e30=",
    state: "encoded",
    truncated: false,
  })
})
it.each([
  '{"id":9223372036854775807}',
  '{"fraction":0.10000000000000001,"zero":-0}',
  '{"key":1,"key":2}',
  '{"escaped":"\\u003c\\/script\\u003e"}',
])("preserves the exact recorded JSON text %s", (text) => {
  expect(bodyPreview(body(text, "application/json"))).toEqual({
    text,
    state: "text",
    truncated: false,
  })
})
it("bounds huge bodies and preserves deeply nested JSON without expansion", () => {
  const huge = "x".repeat(PREVIEW_LIMIT + 1)
  expect(bodyPreview(body(huge, "application/json"))).toEqual({
    text: huge.slice(0, PREVIEW_LIMIT),
    state: "text",
    truncated: true,
  })
  const nested = "[".repeat(4_000) + "1" + "]".repeat(4_000)
  expect(bodyPreview(body(nested, "application/json"))).toEqual({
    text: nested,
    state: "text",
    truncated: false,
  })
})
