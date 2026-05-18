import { afterEach, describe, expect, test, vi } from "vitest"

import {
  MAX_UUID_VALUE,
  SAMPLE_UUID,
  UUID_FORMATS,
  convertUuidValue,
  createRandomUuidBytes,
  createRandomUuidValues,
  createSampleUuidValues,
  parseUuidValue,
} from "./uuid-converter"

const SAMPLE_VALUES = {
  uuid: SAMPLE_UUID,
  base64: "we1n8DS9EfCz/gLXHoQfTw==",
  hex: "c1ed67f034bd11f0b3fe02d71e841f4f",
  decimal: "257773685661231489374926881343358115663",
  octal: "3017326376015136421741317760055343641017517",
  binary:
    "11000001111011010110011111110000001101001011110100010001111100001011001111111110000000101101011100011110100001000001111101001111",
} as const

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("uuid converter core", () => {
  test("creates the documented sample values", () => {
    expect(createSampleUuidValues()).toEqual(SAMPLE_VALUES)
  })

  test("round-trips every supported format through the sample UUID", () => {
    for (const format of UUID_FORMATS) {
      const result = convertUuidValue(format, SAMPLE_VALUES[format])

      expect(result.state).toBe("valid")
      expect(result.values).toEqual(SAMPLE_VALUES)
    }
  })

  test("normalizes common UUID and base variants", () => {
    expect(convertUuidValue("uuid", SAMPLE_UUID.toUpperCase()).values).toEqual(
      SAMPLE_VALUES
    )
    expect(convertUuidValue("uuid", `{${SAMPLE_UUID}}`).values.uuid).toBe(
      SAMPLE_UUID
    )
    expect(
      convertUuidValue("uuid", `urn:uuid:${SAMPLE_UUID}`).values.uuid
    ).toBe(SAMPLE_UUID)
    expect(convertUuidValue("uuid", SAMPLE_VALUES.hex).values.uuid).toBe(
      SAMPLE_UUID
    )
    expect(
      convertUuidValue("hex", `0x${SAMPLE_VALUES.hex.toUpperCase()}`).values
        .uuid
    ).toBe(SAMPLE_UUID)
    expect(
      convertUuidValue("base64", "we1n8DS9EfCz_gLXHoQfTw").values.uuid
    ).toBe(SAMPLE_UUID)
    expect(
      convertUuidValue(
        "base64",
        ` ${SAMPLE_VALUES.base64.slice(0, 12)}
      ${SAMPLE_VALUES.base64.slice(12)} `
      ).values.uuid
    ).toBe(SAMPLE_UUID)
    expect(
      convertUuidValue(
        "binary",
        ` ${SAMPLE_VALUES.binary.slice(0, 64)}
        ${SAMPLE_VALUES.binary.slice(64)} `
      ).values.uuid
    ).toBe(SAMPLE_UUID)
    expect(
      convertUuidValue("decimal", ` ${SAMPLE_VALUES.decimal} `).values.uuid
    ).toBe(SAMPLE_UUID)
  })

  test("keeps nil and max UUID values inside the 128-bit range", () => {
    const nil = convertUuidValue("decimal", "0")
    const max = convertUuidValue("decimal", MAX_UUID_VALUE.toString())

    expect(nil.state).toBe("valid")
    expect(nil.values.uuid).toBe("00000000-0000-0000-0000-000000000000")
    expect(nil.values.binary).toBe("0".repeat(128))

    expect(max.state).toBe("valid")
    expect(max.values.uuid).toBe("ffffffff-ffff-ffff-ffff-ffffffffffff")
    expect(max.values.binary).toBe("1".repeat(128))
  })

  test("returns empty state for blank input in every format", () => {
    for (const format of UUID_FORMATS) {
      const result = convertUuidValue(format, " \n\t ")

      expect(result.state).toBe("empty")
      expect(Object.values(result.values).every((value) => value === "")).toBe(
        true
      )
    }
  })

  test("rejects malformed or out-of-range input", () => {
    const invalidValues = [
      ["uuid", "not-a-uuid"],
      ["base64", "A"],
      ["base64", "abcd"],
      ["base64", "AAA=AAAA"],
      ["hex", "1234"],
      ["decimal", "-1"],
      ["decimal", (MAX_UUID_VALUE + 1n).toString()],
      ["decimal", "12a"],
      ["octal", "8"],
      ["binary", "2"],
      ["binary", "1".repeat(129)],
    ] as const

    for (const [format, value] of invalidValues) {
      const result = convertUuidValue(format, value)

      expect(result.state).toBe("invalid")
      expect(result.values[format]).toBe(value)
    }
  })

  test("treats base64 decoder failures as invalid input", () => {
    vi.stubGlobal(
      "atob",
      vi.fn(() => {
        throw new Error("decode failed")
      })
    )

    expect(convertUuidValue("base64", SAMPLE_VALUES.base64).state).toBe(
      "invalid"
    )
  })

  test("exposes parse results for direct callers", () => {
    expect(parseUuidValue("uuid", "").state).toBe("empty")
    expect(parseUuidValue("uuid", SAMPLE_UUID).state).toBe("valid")
    expect(parseUuidValue("hex", "invalid").state).toBe("invalid")
  })

  test("uses crypto.randomUUID when available", () => {
    const cryptoApi = {
      randomUUID: vi.fn(() => "550e8400-e29b-41d4-a716-446655440000"),
      getRandomValues: vi.fn(),
    } as unknown as Crypto

    expect(createRandomUuidValues(cryptoApi).uuid).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
    expect(cryptoApi.randomUUID).toHaveBeenCalled()
    expect(cryptoApi.getRandomValues).not.toHaveBeenCalled()
  })

  test("falls back to getRandomValues and sets UUID v4 bits", () => {
    const cryptoApi = {
      getRandomValues: vi.fn((bytes: Uint8Array) => {
        bytes.fill(0xff)
        return bytes
      }),
    } as unknown as Crypto
    const bytes = createRandomUuidBytes(cryptoApi)

    expect(cryptoApi.getRandomValues).toHaveBeenCalled()
    expect(bytes[6]).toBe(0x4f)
    expect(bytes[8]).toBe(0xbf)
    expect(
      convertUuidValue("uuid", createRandomUuidValues(cryptoApi).uuid).state
    ).toBe("valid")
  })

  test("falls back when crypto.randomUUID returns an unusable value", () => {
    const cryptoApi = {
      randomUUID: vi.fn(() => "invalid"),
      getRandomValues: vi.fn((bytes: Uint8Array) => {
        bytes.fill(0)
        return bytes
      }),
    } as unknown as Crypto

    expect(createRandomUuidValues(cryptoApi).uuid).toBe(
      "00000000-0000-4000-8000-000000000000"
    )
  })

  test("throws when secure random bytes are unavailable", () => {
    expect(() => createRandomUuidBytes({} as Crypto)).toThrow(
      "Web Crypto random values are unavailable"
    )
  })
})
