import type { UuidV6ClockSequenceMode, UuidV6NodeMode } from "./core/uuid-v6"

type TimestampMode = "now" | "custom"

const DEFAULT_COUNT = 5
const DEFAULT_CUSTOM_NODE = "02:00:00:00:00:01"
const DEFAULT_CUSTOM_CLOCK_SEQUENCE = "0"

const STORAGE_KEYS = {
  count: "tools:uuid-v6-generator:count",
  timestampMode: "tools:uuid-v6-generator:timestamp-mode",
  customDateTime: "tools:uuid-v6-generator:custom-date-time",
  customUnixMilliseconds: "tools:uuid-v6-generator:custom-unix-milliseconds",
  nodeMode: "tools:uuid-v6-generator:node-mode",
  customNode: "tools:uuid-v6-generator:custom-node",
  clockSequenceMode: "tools:uuid-v6-generator:clock-sequence-mode",
  customClockSequence: "tools:uuid-v6-generator:custom-clock-sequence",
} as const

function isTimestampMode(value: string): value is TimestampMode {
  return value === "now" || value === "custom"
}

function isUuidV6NodeMode(value: string): value is UuidV6NodeMode {
  return value === "random" || value === "custom"
}

function isUuidV6ClockSequenceMode(
  value: string
): value is UuidV6ClockSequenceMode {
  return value === "random" || value === "custom"
}

export {
  DEFAULT_COUNT,
  DEFAULT_CUSTOM_CLOCK_SEQUENCE,
  DEFAULT_CUSTOM_NODE,
  STORAGE_KEYS,
  isTimestampMode,
  isUuidV6ClockSequenceMode,
  isUuidV6NodeMode,
}
export type { TimestampMode }
