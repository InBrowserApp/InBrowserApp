import { clampTimePart, normalizeDurationParts } from "../core/timer"

import type { TimerDurationParts } from "../core/timer"

const STORAGE_KEYS = {
  hours: "tools:timer:hours",
  minutes: "tools:timer:minutes",
  seconds: "tools:timer:seconds",
  running: "tools:timer:running",
  remainingMs: "tools:timer:remaining-ms",
  endTime: "tools:timer:end-time",
  soundEnabled: "tools:timer:sound-enabled",
  vibrationEnabled: "tools:timer:vibration-enabled",
  notificationEnabled: "tools:timer:notification-enabled",
} as const

type PersistedTimerState = Readonly<{
  parts: TimerDurationParts
  running: boolean
  remainingMs: number
  endTime: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  notificationEnabled: boolean
}>

function parseStoredNumber(key: string, fallback = 0) {
  const rawValue = window.localStorage.getItem(key)

  if (rawValue === null) {
    return clampTimePart(fallback)
  }

  return clampTimePart(Number(rawValue))
}

function parseStoredBoolean(key: string, fallback: boolean) {
  const rawValue = window.localStorage.getItem(key)

  if (rawValue === null) {
    return fallback
  }

  return rawValue === "true"
}

function loadPersistedTimerState(): PersistedTimerState {
  const parts = normalizeDurationParts({
    hours: parseStoredNumber(STORAGE_KEYS.hours, 0),
    minutes: parseStoredNumber(STORAGE_KEYS.minutes, 5),
    seconds: parseStoredNumber(STORAGE_KEYS.seconds, 0),
  })
  const running = parseStoredBoolean(STORAGE_KEYS.running, false)
  const remainingMs = parseStoredNumber(STORAGE_KEYS.remainingMs, 0)
  const endTime = parseStoredNumber(STORAGE_KEYS.endTime, 0)
  const soundEnabled = parseStoredBoolean(STORAGE_KEYS.soundEnabled, true)
  const vibrationEnabled = parseStoredBoolean(
    STORAGE_KEYS.vibrationEnabled,
    true
  )
  const notificationEnabled = parseStoredBoolean(
    STORAGE_KEYS.notificationEnabled,
    false
  )

  if (running && endTime === 0) {
    return {
      parts,
      running: false,
      remainingMs,
      endTime: 0,
      soundEnabled,
      vibrationEnabled,
      notificationEnabled,
    }
  }

  return {
    parts,
    running,
    remainingMs,
    endTime,
    soundEnabled,
    vibrationEnabled,
    notificationEnabled,
  }
}

export { STORAGE_KEYS, loadPersistedTimerState }
