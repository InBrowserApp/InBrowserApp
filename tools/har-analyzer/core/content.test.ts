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
it("formats JSON while preserving invalid JSON, plain text, and encoded content", () => {
  expect(bodyPreview(body('{"ok":true}', "application/json")).text).toBe(
    '{\n  "ok": true\n}'
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
it("bounds huge bodies before JSON parsing and after pretty-print expansion", () => {
  const huge = "x".repeat(PREVIEW_LIMIT + 1)
  expect(bodyPreview(body(huge, "application/json"))).toEqual({
    text: huge.slice(0, PREVIEW_LIMIT),
    state: "text",
    truncated: true,
  })
  expect(
    bodyPreview(body(JSON.stringify(Array(20_000).fill(1)), "application/json"))
      .truncated
  ).toBe(true)
})
