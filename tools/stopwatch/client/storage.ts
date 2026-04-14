const STORAGE_KEYS = {
  running: "tools:stopwatch:running",
  startTime: "tools:stopwatch:start-time",
  accumulatedMs: "tools:stopwatch:accumulated",
  laps: "tools:stopwatch:laps",
} as const

type PersistedStopwatchState = Readonly<{
  running: boolean
  startTime: number
  accumulatedMs: number
  laps: number[]
}>

function parseStoredNumber(key: string) {
  const rawValue = window.localStorage.getItem(key)

  if (rawValue === null) {
    return 0
  }

  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.floor(parsedValue)
    : 0
}

function parseStoredLaps() {
  const rawValue = window.localStorage.getItem(STORAGE_KEYS.laps)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value >= 0)
      .map((value) => Math.floor(value))
  } catch {
    return []
  }
}

function loadPersistedStopwatchState(): PersistedStopwatchState {
  const running = window.localStorage.getItem(STORAGE_KEYS.running) === "true"
  const startTime = parseStoredNumber(STORAGE_KEYS.startTime)
  const accumulatedMs = parseStoredNumber(STORAGE_KEYS.accumulatedMs)
  const laps = parseStoredLaps()

  if (running && startTime === 0) {
    return {
      running: false,
      startTime: 0,
      accumulatedMs,
      laps,
    }
  }

  return {
    running,
    startTime,
    accumulatedMs,
    laps,
  }
}

export { STORAGE_KEYS, loadPersistedStopwatchState }
