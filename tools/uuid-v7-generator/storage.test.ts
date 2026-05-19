import { afterEach, describe, expect, test } from "vitest"

import { readStoredUuidV7Options } from "./storage"

afterEach(() => {
  window.localStorage.clear()
})

describe("uuid v7 storage", () => {
  test("returns empty options without saved settings", () => {
    expect(readStoredUuidV7Options()).toEqual({})
  })

  test("restores saved options", () => {
    window.localStorage.setItem("tools:uuid-v7-generator:mode", "batch")
    window.localStorage.setItem("tools:uuid-v7-generator:count", "3")
    window.localStorage.setItem(
      "tools:uuid-v7-generator:timestamp-mode",
      "custom"
    )
    window.localStorage.setItem(
      "tools:uuid-v7-generator:custom-date-time",
      "2026-04-15T08:30:45.123"
    )
    window.localStorage.setItem(
      "tools:uuid-v7-generator:custom-unix-milliseconds",
      "12345"
    )

    expect(readStoredUuidV7Options()).toEqual({
      mode: "batch",
      count: 3,
      timestampMode: "custom",
      customDateTimeInput: "2026-04-15T08:30:45.123",
      customUnixMillisecondsInput: "12345",
    })
  })

  test("treats legacy saved counts above one as batch mode", () => {
    window.localStorage.setItem("tools:uuid-v7-generator:count", "2")

    expect(readStoredUuidV7Options()).toMatchObject({
      mode: "batch",
      count: 2,
    })
  })

  test("derives Unix milliseconds from saved datetime when needed", () => {
    window.localStorage.setItem(
      "tools:uuid-v7-generator:custom-date-time",
      "1970-01-01T00:00:02.345"
    )

    expect(readStoredUuidV7Options()).toMatchObject({
      customDateTimeInput: "1970-01-01T00:00:02.345",
      customUnixMillisecondsInput: String(
        new Date(1970, 0, 1, 0, 0, 2, 345).getTime()
      ),
    })
  })

  test("ignores invalid enum and number values", () => {
    window.localStorage.setItem("tools:uuid-v7-generator:mode", "other")
    window.localStorage.setItem("tools:uuid-v7-generator:count", "nan")
    window.localStorage.setItem(
      "tools:uuid-v7-generator:timestamp-mode",
      "other"
    )

    expect(readStoredUuidV7Options()).toEqual({})
  })
})
