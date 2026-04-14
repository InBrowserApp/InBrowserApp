const STORAGE_KEYS = {
  fromInput: "tools:time-zone-converter:from-input",
  toInput: "tools:time-zone-converter:to-input",
  fromTimeZone: "tools:time-zone-converter:from-timezone",
  toTimeZone: "tools:time-zone-converter:to-timezone",
} as const

function readStoredString(key: string, fallback: string) {
  const storedValue = window.localStorage.getItem(key)

  return storedValue ?? fallback
}

export { STORAGE_KEYS, readStoredString }
