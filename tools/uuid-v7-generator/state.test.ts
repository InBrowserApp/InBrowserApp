import { describe, expect, test, vi } from "vitest"

import {
  formatMessage,
  getCurrentUnixMilliseconds,
  getTimestampError,
  normalizeUuidV7BatchCount,
  parseUnixMillisecondsInput,
} from "./state"

const messages = {
  timestampInvalid: "Invalid timestamp.",
  timestampOutOfRange: "Timestamp must be between {min} and {max}.",
}

describe("uuid v7 state helpers", () => {
  test("reads the current Unix millisecond clock", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234)

    expect(getCurrentUnixMilliseconds()).toBe(1234)

    vi.restoreAllMocks()
  })

  test("parses Unix millisecond input", () => {
    expect(parseUnixMillisecondsInput("1234.9")).toBe(1234)
    expect(parseUnixMillisecondsInput("")).toBeNull()
    expect(parseUnixMillisecondsInput("not-a-number")).toBeNull()
  })

  test("normalizes batch count to the batch range", () => {
    expect(normalizeUuidV7BatchCount(undefined)).toBe(10)
    expect(normalizeUuidV7BatchCount(1)).toBe(2)
    expect(normalizeUuidV7BatchCount(101)).toBe(100)
  })

  test("formats template messages", () => {
    expect(formatMessage("{min} to {max}", { min: 0, max: 10 })).toBe("0 to 10")
    expect(formatMessage("{missing}", {})).toBe("")
  })

  test("returns timestamp errors only for invalid custom timestamps", () => {
    expect(getTimestampError(messages, "now", null)).toBe("")
    expect(getTimestampError(messages, "custom", null)).toBe(
      "Invalid timestamp."
    )
    expect(getTimestampError(messages, "custom", -1)).toBe(
      "Timestamp must be between 0 and 281474976710655."
    )
    expect(getTimestampError(messages, "custom", 1234)).toBe("")
  })
})
