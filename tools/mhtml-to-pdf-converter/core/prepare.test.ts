// @vitest-environment jsdom
import { expect, test } from "vitest"
import { prepare } from "./prepare"
import { failure } from "./errors"

const archive = {
  source: '<h1>Archived café</h1><img src="data:image/png;base64,YQ==">',
  location: "https://original.invalid/report",
  archiveNotes: { truncated: false, encoding: false, nested: false },
}

test("prepares contained archive content without adding its original URL", () => {
  const result = prepare(archive)
  expect(result.html).toContain("Archived café")
  expect(result.html).toContain("data:image/png;base64,YQ==")
  expect(result.html).not.toContain("original.invalid")
  expect(result.css).toContain("#pdf-content")
})

test.each([
  ["truncated", "incomplete"],
  ["encoding", "encoding"],
  ["nested", "nested"],
])("rejects %s archives before printing recovered content", (note, code) => {
  expect(() =>
    prepare({
      ...archive,
      archiveNotes: { ...archive.archiveNotes, [note!]: true },
    })
  ).toThrow(code)
})

test("refuses unresolved archived resources and empty static content", () => {
  expect(() =>
    prepare({ ...archive, source: '<h1>Report</h1><img src="missing.png">' })
  ).toThrow("unsupported")
  expect(() =>
    prepare({ ...archive, source: "<script>bad()</script>" })
  ).toThrow("invalid")
})

test("maps parser, print and resource failures without exposing internals", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "resource",
    "engineUnavailable",
    "incomplete",
    "nested",
    "structure",
    "email",
  ])
    expect(failure(new Error(code)).code).toBe(code)
  expect(failure(new Error("resourceLimit")).code).toBe("resource")
  expect(failure(new RangeError("allocation failed")).code).toBe("resource")
  expect(failure(Object.assign(new Error("private"), { page: 4 }))).toEqual({
    code: "unsupported",
    page: 4,
  })
  expect(failure(Object.assign(new Error("private"), { page: "4" }))).toEqual({
    code: "invalid",
    page: undefined,
  })
  expect(failure(null).code).toBe("invalid")
})
