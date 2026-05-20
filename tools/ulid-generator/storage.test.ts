import { beforeEach, describe, expect, test } from "vitest"

import { readStoredUlidOptions } from "./storage"

describe("ulid generator storage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test("returns empty options when storage is empty", () => {
    expect(readStoredUlidOptions()).toEqual({})
  })

  test("reads valid stored options", () => {
    window.localStorage.setItem("tools:ulid-generator:generation-mode", "batch")
    window.localStorage.setItem("tools:ulid-generator:count", "2")
    window.localStorage.setItem("tools:ulid-generator:timestamp-mode", "custom")
    window.localStorage.setItem(
      "tools:ulid-generator:custom-date-time",
      "2026-04-15T08:30:45.123"
    )
    window.localStorage.setItem(
      "tools:ulid-generator:custom-unix-milliseconds",
      "12345"
    )
    window.localStorage.setItem("tools:ulid-generator:monotonic-batch", "false")

    expect(readStoredUlidOptions()).toEqual({
      generationMode: "batch",
      count: 2,
      timestampMode: "custom",
      customDateTimeInput: "2026-04-15T08:30:45.123",
      customUnixMillisecondsInput: "12345",
      monotonicBatch: false,
    })
  })

  test("falls back from stored datetime when unix milliseconds are absent", () => {
    window.localStorage.setItem("tools:ulid-generator:generation-mode", "bad")
    window.localStorage.setItem("tools:ulid-generator:count", "1")
    window.localStorage.setItem("tools:ulid-generator:timestamp-mode", "bad")
    window.localStorage.setItem(
      "tools:ulid-generator:custom-date-time",
      "1970-01-01T00:00:01.234"
    )

    expect(readStoredUlidOptions()).toEqual({
      count: 2,
      customDateTimeInput: "1970-01-01T00:00:01.234",
      customUnixMillisecondsInput: String(
        new Date(1970, 0, 1, 0, 0, 1, 234).getTime()
      ),
    })
  })
})
