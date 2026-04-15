type TimerDurationParts = Readonly<{
  hours: number
  minutes: number
  seconds: number
}>

type RemainingTimeArgs = Readonly<{
  running: boolean
  remainingMs: number
  endTime: number
  nowMs: number
}>

type RunModeArgs = Readonly<{
  running: boolean
  displayRemainingMs: number
  durationMs: number
}>

type ResetStateArgs = Readonly<{
  running: boolean
  displayRemainingMs: number
  durationMs: number
}>

function clampTimePart(value: number | null | undefined, max?: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  const safeValue = Math.max(0, Math.floor(value ?? 0))

  if (typeof max === "number") {
    return Math.min(max, safeValue)
  }

  return safeValue
}

function normalizeDurationParts(parts: TimerDurationParts): TimerDurationParts {
  return {
    hours: clampTimePart(parts.hours),
    minutes: clampTimePart(parts.minutes, 59),
    seconds: clampTimePart(parts.seconds, 59),
  }
}

function buildDurationMs(parts: TimerDurationParts) {
  const normalizedParts = normalizeDurationParts(parts)

  return (
    (normalizedParts.hours * 3600 +
      normalizedParts.minutes * 60 +
      normalizedParts.seconds) *
    1000
  )
}

function buildDurationPartsFromPreset(
  presetMinutes: number
): TimerDurationParts {
  const totalSeconds = clampTimePart(presetMinutes) * 60

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function getDisplayRemainingMs({
  running,
  remainingMs,
  endTime,
  nowMs,
}: RemainingTimeArgs) {
  if (!running) {
    return clampTimePart(remainingMs)
  }

  return Math.max(0, Math.floor(endTime - nowMs))
}

function getRunMode({ running, displayRemainingMs, durationMs }: RunModeArgs) {
  if (running) {
    return "pause"
  }

  if (displayRemainingMs === 0 || displayRemainingMs === durationMs) {
    return "start"
  }

  return "resume"
}

function getCanReset({
  running,
  displayRemainingMs,
  durationMs,
}: ResetStateArgs) {
  return !running && durationMs > 0 && displayRemainingMs !== durationMs
}

function formatPresetLabel(template: string, presetMinutes: number) {
  return template.replace("{minutes}", String(clampTimePart(presetMinutes)))
}

export {
  buildDurationMs,
  buildDurationPartsFromPreset,
  clampTimePart,
  formatPresetLabel,
  getCanReset,
  getDisplayRemainingMs,
  getRunMode,
  normalizeDurationParts,
}
export type { TimerDurationParts }
