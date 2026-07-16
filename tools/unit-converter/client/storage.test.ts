import { afterEach, describe, expect, test, vi } from "vitest"

import { createDefaultUnits, STORAGE_KEY } from "./constants"
import { parseStoredState, readStoredState, writeStoredState } from "./storage"

function validStoredValue() {
  return {
    version: 1,
    category: "temperature" as const,
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
      precision: "10",
      units: createDefaultUnits(),
      value: "100",
    })
  })

  test.each([
    null,
    "{broken",
    JSON.stringify(null),
    JSON.stringify({ ...validStoredValue(), version: 2 }),
    JSON.stringify({ ...validStoredValue(), category: "__proto__" }),
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
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"version":1')
    const { version: _version, ...expected } = state
    expect(readStoredState()).toEqual(expected)
  })

  test("falls back when storage reads throw", () => {
    expect(
      readStoredState({
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
