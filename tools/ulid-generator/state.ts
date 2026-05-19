import { ULID_MAX_TIMESTAMP_MS, isValidUlidTimestampMs } from "./core/ulid"

import type { UlidMessages } from "./types"

type TimestampMode = "now" | "custom"
type GenerationMode = "single" | "batch"

function getCurrentUnixMilliseconds() {
  return Date.now()
}

function parseUnixMillisecondsInput(value: string) {
  if (value.trim() === "") {
    return null
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return Math.floor(parsed)
}

function formatMessage(
  template: string,
  replacements: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/gu, (_, key: string) =>
    Object.hasOwn(replacements, key) ? String(replacements[key]) : ""
  )
}

function getTimestampError(
  messages: Pick<UlidMessages, "timestampInvalid" | "timestampOutOfRange">,
  timestampMode: TimestampMode,
  customUnixMilliseconds: number | null
) {
  if (timestampMode !== "custom") {
    return ""
  }

  if (customUnixMilliseconds === null) {
    return messages.timestampInvalid
  }

  if (!isValidUlidTimestampMs(customUnixMilliseconds)) {
    return formatMessage(messages.timestampOutOfRange, {
      min: 0,
      max: ULID_MAX_TIMESTAMP_MS,
    })
  }

  return ""
}

export {
  formatMessage,
  getCurrentUnixMilliseconds,
  getTimestampError,
  parseUnixMillisecondsInput,
}
export type { GenerationMode, TimestampMode }
