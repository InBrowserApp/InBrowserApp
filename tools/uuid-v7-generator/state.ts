import {
  UUID_V7_MAX_TIMESTAMP_MS,
  UUID_V7_MIN_BATCH_COUNT,
  normalizeUuidV7Count,
  isValidUuidV7TimestampMs,
} from "./core/uuid-v7"

import type { UuidV7Messages } from "./types"
import type { UuidV7TimestampMode } from "./types"

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

function normalizeUuidV7BatchCount(value: number | null | undefined) {
  return Math.max(UUID_V7_MIN_BATCH_COUNT, normalizeUuidV7Count(value))
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
  messages: Pick<UuidV7Messages, "timestampInvalid" | "timestampOutOfRange">,
  timestampMode: UuidV7TimestampMode,
  customUnixMilliseconds: number | null
) {
  if (timestampMode !== "custom") {
    return ""
  }

  if (customUnixMilliseconds === null) {
    return messages.timestampInvalid
  }

  if (!isValidUuidV7TimestampMs(customUnixMilliseconds)) {
    return formatMessage(messages.timestampOutOfRange, {
      min: 0,
      max: UUID_V7_MAX_TIMESTAMP_MS,
    })
  }

  return ""
}

export {
  formatMessage,
  getCurrentUnixMilliseconds,
  getTimestampError,
  normalizeUuidV7BatchCount,
  parseUnixMillisecondsInput,
}
