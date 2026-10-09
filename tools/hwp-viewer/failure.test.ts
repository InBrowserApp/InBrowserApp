import { expect, test } from "vitest"
import { failure } from "./failure"
test.each([
  "invalid",
  "empty",
  "protected",
  "distribution",
  "legacy",
  "resourceLimit",
  "engineUnavailable",
  "browserUnsupported",
  "pageError",
])("preserves a classified failure %s", (message) => {
  expect(failure(new Error(message))).toBe(message)
})
test.each([
  "out of memory",
  "allocation failed",
  "stack exhausted",
  "XML budget exceeded",
  "input too large",
])("explains a genuine resource failure %s", (message) => {
  expect(failure(message)).toBe("resourceLimit")
})
test.each(["encrypted file", "DRM document", "비밀번호가 필요합니다"])(
  "recognizes protected-engine failures %s",
  (message) => {
    expect(failure(message)).toBe("protected")
  }
)
test("keeps unknown errors generic", () => {
  expect(failure(null)).toBe("invalid")
})
