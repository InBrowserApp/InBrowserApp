import { describe, expect, test, vi } from "vitest"

import {
  formatMessage,
  getCurrentUnixMilliseconds,
  getTimestampError,
  parseUnixMillisecondsInput,
} from "./state"
import { ULID_MAX_TIMESTAMP_MS } from "./core/ulid"

const messages = {
  timestampInvalid: "Invalid timestamp.",
  timestampOutOfRange:
    "Timestamp must be between {min} and {max} (Unix milliseconds).",
} as const

describe("ulid generator state helpers", () => {
  test("parses unix millisecond input", () => {
    expect(parseUnixMillisecondsInput("")).toBeNull()
    expect(parseUnixMillisecondsInput("not-a-number")).toBeNull()
    expect(parseUnixMillisecondsInput("1234.9")).toBe(1234)
  })

  test("formats known placeholders and drops unknown placeholders", () => {
    expect(formatMessage("{known}:{missing}", { known: "value" })).toBe(
      "value:"
    )
  })

  test("returns timestamp errors for invalid custom values only", () => {
    expect(getTimestampError(messages, "now", null)).toBe("")
    expect(getTimestampError(messages, "custom", null)).toBe(
      "Invalid timestamp."
    )
    expect(
      getTimestampError(messages, "custom", ULID_MAX_TIMESTAMP_MS + 1)
    ).toBe(
      `Timestamp must be between 0 and ${ULID_MAX_TIMESTAMP_MS} (Unix milliseconds).`
    )
    expect(getTimestampError(messages, "custom", 0)).toBe("")
  })

  test("reads current unix milliseconds from Date.now", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234)

    expect(getCurrentUnixMilliseconds()).toBe(1234)
  })
})
