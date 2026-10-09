import { expect, test } from "vitest"
import { failureMessage } from "./failure"
import m from "./messages/en.json"

test("explains known format, protection, missing-resource and memory outcomes", () => {
  for (const [message, key] of [
    ["REFERENCE_ONLY", "descriptor"],
    ["MISSING_PAGES", "missingPages"],
    ["ENGINE_UNAVAILABLE", "engineUnavailable"],
  ] as const)
    expect(failureMessage(new Error(message), m)).toBe(m[key])
  for (const [code, message, key] of [
    ["UNSUPPORTED_FORMAT", "unknown", "unsupported"],
    ["ENCRYPTED_PDF", "encrypted", "protected"],
    ["PDF_LIMIT_EXCEEDED", "limit", "resource"],
    ["HNC8", "required font missing", "fontsRequired"],
    ["HNC8", "unsupported image code", "unsupported"],
    ["INVALID_INPUT", "damaged", "invalid"],
  ] as const)
    expect(failureMessage(Object.assign(new Error(message), { code }), m)).toBe(
      m[key]
    )
  expect(failureMessage(new RangeError("array buffer"), m)).toBe(m.resource)
  expect(failureMessage(new Error("out of memory"), m)).toBe(m.resource)
  expect(failureMessage(null, m)).toBe(m.invalid)
  expect(failureMessage(new Error("bad document"), m)).toBe(m.invalid)
})
