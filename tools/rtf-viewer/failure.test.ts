import { expect, it } from "vitest"
import { failure } from "./failure"
import { diagnosticMessages } from "./diagnostics"
import m from "./messages/en.json"
it("distinguishes missing content, allocation failures and damaged files", () => {
  expect(failure(new Error("empty"), m)).toBe(m.empty)
  expect(failure(new RangeError("decoded image budget"), m)).toBe(
    m.resourceLimit
  )
  expect(failure("memory allocation", m)).toBe(m.resourceLimit)
  expect(failure(new RangeError("Invalid RTF paper size"), m)).toBe(m.invalid)
  expect(failure(null, m)).toBe(m.invalid)
})
it("groups known omissions without exposing technical parser diagnostics", () => {
  const diagnostics = [
    "system-font-environment",
    "unsupported-vector-image",
    "invalid-picture-hex",
    "unsupported-bidirectional-text",
    "unsupported-destination",
    "unsupported-table-header-row",
  ].map((code) => ({
    code,
    message:
      code === "unsupported-destination"
        ? "Destination \\object was skipped"
        : "technical",
    offset: 0,
  }))
  expect(diagnosticMessages(diagnostics, m)).toEqual([
    m.imageNote,
    m.encodingNote,
    m.objectNote,
    m.partial,
  ])
})
