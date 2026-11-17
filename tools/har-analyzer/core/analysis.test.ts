import { expect, it } from "vitest"
import {
  formatBytes,
  formatTime,
  isFailure,
  requestName,
  selectEntries,
} from "./analysis"
import { parseHar } from "./parse"
import { exampleHar } from "../sample"

const entries = parseHar(exampleHar()).entries

it("filters failures, redirects, and case-insensitive terms without mutating the capture", () => {
  expect(
    selectEntries(entries, "", "failed", "start").map((item) => item.status)
  ).toEqual([503, 404, 0])
  expect(
    selectEntries(entries, "", "redirects", "start").map((item) => item.status)
  ).toEqual([304])
  expect(
    selectEntries(entries, "  GET JSON 200 ", "all", "start")
  ).toHaveLength(1)
  expect(selectEntries(entries, "never-match", "all", "start")).toEqual([])
  expect(selectEntries(entries, "", "all", "slowest")[0]?.status).toBe(503)
  expect(selectEntries(entries, "", "all", "largest")[0]?.url).toContain(
    "app.js"
  )
  expect(entries[0]?.id).toBe(0)
  expect(isFailure(entries[0]!)).toBe(false)
})

it("sorts unknown values last with stable ordering for ties", () => {
  const values = [
    { ...entries[0]!, id: 4, duration: null, transferSize: null },
    { ...entries[0]!, id: 2, duration: 0, transferSize: 0 },
    { ...entries[0]!, id: 3, duration: null, transferSize: null },
  ]
  expect(selectEntries(values, "", "all", "slowest").map((e) => e.id)).toEqual([
    2, 3, 4,
  ])
  expect(selectEntries(values, "", "all", "largest").map((e) => e.id)).toEqual([
    2, 3, 4,
  ])
  expect(selectEntries(values, "", "all", "start").map((e) => e.id)).toEqual([
    2, 3, 4,
  ])
})

it.each([
  ["https://example.com/assets/app.js?x=1", "app.js"],
  ["https://example.com/", "example.com"],
  ["file:///", "file:///"],
  ["invalid url", "invalid url"],
])("gets a readable name for %s", (url, name) => {
  expect(requestName(url)).toBe(name)
})

it("formats milliseconds, seconds, bytes, and unknowns with locale-aware numbers", () => {
  expect(formatTime(null, "en", "unknown")).toBe("unknown")
  expect(formatTime(0, "en", "?")).toBe("0\u00a0ms")
  expect(formatTime(1234, "en", "?")).toBe("1.23\u00a0s")
  expect(formatTime(1.5, "de", "?")).toBe("1,5\u00a0ms")
  expect(formatBytes(null, "en", "unknown")).toBe("unknown")
  expect(formatBytes(0, "en", "?")).toBe("0\u00a0B")
  expect(formatBytes(1536, "en", "?")).toBe("1.5\u00a0KiB")
  expect(formatBytes(1048576, "en", "?")).toBe("1\u00a0MiB")
})

it("preserves locale and precision when time and byte formatting are interleaved", () => {
  for (let i = 0; i < 2; i++) {
    expect(formatTime(1234, "de", "?")).toBe("1,23\u00a0s")
    expect(formatBytes(123, "de", "?")).toBe("123\u00a0B")
    expect(formatBytes(1536, "en", "?")).toBe("1.5\u00a0KiB")
    expect(formatTime(1.25, "de", "?")).toBe("1,3\u00a0ms")
    expect(formatTime(1234, "en", "?")).toBe("1.23\u00a0s")
  }
})
