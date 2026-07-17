import { afterEach, describe, expect, test, vi } from "vitest"

import { createDefaultUnits, STORAGE_KEY } from "./constants"
import {
  localizeStoredValue,
  parseStoredState,
  readStoredState,
  writeStoredState,
} from "./storage"

function validStoredValue() {
  return {
    version: 2,
    category: "temperature" as const,
    locale: "en",
    precision: "10" as const,
    units: createDefaultUnits(),
    value: "100",
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe("stored unit converter state", () => {
  test("parses a fully validated state", () => {
    expect(parseStoredState(JSON.stringify(validStoredValue()))).toEqual({
      category: "temperature",
      locale: "en",
      precision: "10",
      units: createDefaultUnits(),
      value: "100",
    })
  })

  test.each([
    null,
    "{broken",
    JSON.stringify(null),
    JSON.stringify({ ...validStoredValue(), version: 1 }),
    JSON.stringify({ ...validStoredValue(), category: "__proto__" }),
    JSON.stringify({ ...validStoredValue(), locale: "" }),
    JSON.stringify({ ...validStoredValue(), value: 100 }),
    JSON.stringify({ ...validStoredValue(), precision: "3" }),
    JSON.stringify({ ...validStoredValue(), units: null }),
    JSON.stringify({
      ...validStoredValue(),
      units: { ...createDefaultUnits(), length: null },
    }),
    JSON.stringify({
      ...validStoredValue(),
      units: {
        ...createDefaultUnits(),
        length: { from: "unknown", to: "foot" },
      },
    }),
  ])("rejects unsafe or malformed state %#", (raw) => {
    expect(parseStoredState(raw)).toBeUndefined()
  })

  test("writes and reads one versioned storage entry", () => {
    const state = validStoredValue()

    expect(writeStoredState(state)).toBe(true)
    expect(window.localStorage.length).toBe(1)
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"version":2')
    const { version: _version, ...expected } = state
    expect(readStoredState("en")).toEqual(expected)
  })

  test("re-localizes valid values when the page locale changes", () => {
    expect(localizeStoredValue("1.234,5", "de", "en")).toBe("1234.5")
    expect(localizeStoredValue("1,234.5", "en", "de")).toBe("1234,5")
  })

  test("preserves invalid input when the page locale changes", () => {
    expect(localizeStoredValue("not a number", "de", "en")).toBe("not a number")
  })

  test("falls back when storage reads throw", () => {
    expect(
      readStoredState("en", {
        getItem() {
          throw new Error("blocked")
        },
      })
    ).toBeUndefined()
  })

  test("does not crash when storage writes throw", () => {
    expect(
      writeStoredState(validStoredValue(), {
        setItem() {
          throw new Error("quota")
        },
      })
    ).toBe(false)
  })
})
