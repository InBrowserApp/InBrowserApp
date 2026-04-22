const STORAGE_KEYS = {
  startInput: "tools:time-diff-calculator:start-input",
  endInput: "tools:time-diff-calculator:end-input",
  startTimeZone: "tools:time-diff-calculator:start-timezone",
  endTimeZone: "tools:time-diff-calculator:end-timezone",
} as const

function readStoredString(key: string, fallback: string) {
  const storedValue = window.localStorage.getItem(key)

  return storedValue ?? fallback
}

export { STORAGE_KEYS, readStoredString }
