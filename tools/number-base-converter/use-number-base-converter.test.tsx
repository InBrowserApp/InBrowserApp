import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test } from "vitest"

import { useNumberBaseConverter } from "./use-number-base-converter"

const STORAGE_KEYS = {
  decimal: "tools:number-base-converter:decimal",
  customBase: "tools:number-base-converter:custom-base",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

describe("useNumberBaseConverter", () => {
  test("falls back to the default example when stored decimal is invalid", () => {
    window.localStorage.setItem(STORAGE_KEYS.decimal, "xyz")
    window.localStorage.setItem(STORAGE_KEYS.customBase, "128")

    const { result } = renderHook(() => useNumberBaseConverter())

    expect(result.current.customBase).toBe(64)
    expect(result.current.fields.decimal).toBe("255")
    expect(result.current.fields.base64).toBe("D/")
  })

  test("restores an intentionally empty saved state", () => {
    window.localStorage.setItem(STORAGE_KEYS.decimal, "")

    const { result } = renderHook(() => useNumberBaseConverter())

    expect(result.current.fields).toEqual({
      binary: "",
      octal: "",
      decimal: "",
      hex: "",
      base32: "",
      base36: "",
      base62: "",
      base64: "",
      custom: "",
    })
  })

  test("updates every setter-backed field", async () => {
    const { result } = renderHook(() => useNumberBaseConverter())

    act(() => {
      result.current.setBinary("1010")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("10")
    })

    act(() => {
      result.current.setOctal("12")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("10")
    })

    act(() => {
      result.current.setHex("1f")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("31")
    })

    act(() => {
      result.current.setBase32("100")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("1024")
    })

    act(() => {
      result.current.setBase36("zz")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("1295")
    })

    act(() => {
      result.current.setBase62("Az")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("2267")
    })

    act(() => {
      result.current.setBase64("D/")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("255")
    })

    act(() => {
      result.current.setCustomBase(16)
    })
    await waitFor(() => {
      expect(result.current.customBase).toBe(16)
      expect(result.current.fields.custom).toBe("ff")
    })

    act(() => {
      result.current.setCustom("1f")
    })
    await waitFor(() => {
      expect(result.current.fields.decimal).toBe("31")
    })
  })

  test("clears derived fields when the current input becomes empty", async () => {
    const { result } = renderHook(() => useNumberBaseConverter())

    act(() => {
      result.current.setBinary("")
    })

    await waitFor(() => {
      expect(result.current.fields).toEqual({
        binary: "",
        octal: "",
        decimal: "",
        hex: "",
        base32: "",
        base36: "",
        base62: "",
        base64: "",
        custom: "",
      })
    })
  })

  test("keeps the active value when the decimal field is invalid during base changes", async () => {
    const { result } = renderHook(() => useNumberBaseConverter())

    act(() => {
      result.current.setDecimal("xyz")
    })
    await waitFor(() => {
      expect(result.current.invalidStates.decimal).toBe(true)
    })

    act(() => {
      result.current.setCustomBase(16)
    })

    await waitFor(() => {
      expect(result.current.customBase).toBe(16)
      expect(result.current.fields.decimal).toBe("xyz")
      expect(result.current.fields.custom).toBe("4n")
    })
  })

  test("resets the default example and persists the current decimal value", async () => {
    const { result } = renderHook(() => useNumberBaseConverter())

    act(() => {
      result.current.setDecimal("42")
    })
    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.decimal)).toBe("42")
    })

    act(() => {
      result.current.reset()
    })

    await waitFor(() => {
      expect(result.current.customBase).toBe(58)
      expect(result.current.fields.decimal).toBe("255")
      expect(window.localStorage.getItem(STORAGE_KEYS.decimal)).toBe("255")
      expect(window.localStorage.getItem(STORAGE_KEYS.customBase)).toBe("58")
    })
  })
})
