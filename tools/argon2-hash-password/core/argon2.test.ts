import { describe, expect, test, vi } from "vitest"

import {
  MAX_ARGON2_MEMORY_SIZE,
  MIN_SALT_BYTES,
  assertArgon2Params,
  bytesToBase64,
  decodeBase64,
  formatMemorySize,
  generateArgon2Hash,
  generateRandomSalt,
  normalizeBase64Input,
  parseIntegerRangeInput,
  selectArgon2Implementation,
  validateBase64Salt,
  type Argon2Implementations,
} from "./argon2"

const salt = "AAECAwQFBgcICQoLDA0ODw=="
const baseParams = {
  algorithm: "argon2id" as const,
  password: "correct horse battery staple",
  salt,
  iterations: 1,
  memorySize: 8,
  parallelism: 1,
  hashLength: 16,
}

describe("generateArgon2Hash", () => {
  test("generates an encoded Argon2 hash with the default implementation", async () => {
    await expect(generateArgon2Hash(baseParams)).resolves.toBe(
      "$argon2id$v=19$m=8,t=1,p=1$AAECAwQFBgcICQoLDA0ODw$5LgcbudfkRHqvlyY43iEbw"
    )
  })

  test("selects the requested algorithm implementation", async () => {
    const implementations = {
      argon2id: vi.fn(async () => "id"),
      argon2i: vi.fn(async () => "i"),
      argon2d: vi.fn(async () => "d"),
    } satisfies Argon2Implementations

    await expect(generateArgon2Hash(baseParams, implementations)).resolves.toBe(
      "id"
    )
    await expect(
      generateArgon2Hash(
        {
          ...baseParams,
          algorithm: "argon2i",
          secret: "pepper",
        },
        implementations
      )
    ).resolves.toBe("i")
    await expect(
      generateArgon2Hash(
        {
          ...baseParams,
          algorithm: "argon2d",
          secret: "   ",
        },
        implementations
      )
    ).resolves.toBe("d")

    expect(implementations.argon2i).toHaveBeenCalledWith(
      expect.objectContaining({ secret: "pepper" })
    )
    expect(implementations.argon2d).toHaveBeenCalledWith(
      expect.objectContaining({ secret: undefined })
    )
    expect(selectArgon2Implementation("argon2id", implementations)).toBe(
      implementations.argon2id
    )
  })

  test("rejects invalid Argon2 parameter combinations", async () => {
    expect(() => assertArgon2Params({ ...baseParams, password: "" })).toThrow(
      "Password is required."
    )
    expect(() =>
      assertArgon2Params({ ...baseParams, salt: "AAECAw==" })
    ).toThrow("Salt must decode to at least 8 bytes.")
    expect(() => assertArgon2Params({ ...baseParams, salt: "!!!!" })).toThrow(
      "Invalid base64 input."
    )
    expect(() => assertArgon2Params({ ...baseParams, iterations: 0 })).toThrow(
      "Argon2 parameters must be positive whole numbers."
    )
    expect(() => assertArgon2Params({ ...baseParams, hashLength: 3 })).toThrow(
      "Hash length must be at least 4 bytes."
    )
    expect(() => assertArgon2Params({ ...baseParams, memorySize: 7 })).toThrow(
      "Memory size must be at least 8 KiB per lane."
    )
    expect(() =>
      assertArgon2Params({
        ...baseParams,
        memorySize: MAX_ARGON2_MEMORY_SIZE + 1,
      })
    ).toThrow("Memory size exceeds the browser limit.")
  })
})

describe("salt helpers", () => {
  test("normalizes and decodes Base64 input", () => {
    expect(normalizeBase64Input("AAEC-_ \n")).toBe("AAEC+/")
    expect(decodeBase64("SGVsbG8=")).toEqual(
      Uint8Array.from(Buffer.from("Hello"))
    )
    expect(decodeBase64("")).toEqual(new Uint8Array())
    expect(() => decodeBase64("abcde")).toThrow("Invalid base64 length.")
  })

  test("wraps browser Base64 decoder failures", () => {
    const originalAtob = globalThis.atob
    vi.stubGlobal("atob", () => {
      throw new Error("decoder failure")
    })

    try {
      expect(() => decodeBase64("AAAA")).toThrow("Invalid base64 input.")
    } finally {
      vi.stubGlobal("atob", originalAtob)
    }
  })

  test("validates Base64 salt length", () => {
    expect(validateBase64Salt(salt)).toBe("")
    expect(validateBase64Salt("AAECAw==")).toBe("tooShort")
    expect(validateBase64Salt("!!!!")).toBe("base64")
  })

  test("converts bytes to Base64 and generates random salts", () => {
    const randomSource = {
      getRandomValues: <T extends ArrayBufferView | null>(array: T) => {
        if (array instanceof Uint8Array) {
          array.set(Array.from({ length: array.length }, (_, index) => index))
        }
        return array
      },
    }

    expect(bytesToBase64(Uint8Array.of(72, 105))).toBe("SGk=")
    expect(generateRandomSalt(4, randomSource)).toBe("AAECAwQFBgc=")
    expect(generateRandomSalt(MIN_SALT_BYTES, randomSource)).toBe(
      "AAECAwQFBgc="
    )
    expect(() => generateRandomSalt(16, null)).toThrow(
      "Random salt generation requires Web Crypto support."
    )
  })
})

describe("parameter helpers", () => {
  test("parses bounded whole-number inputs", () => {
    expect(parseIntegerRangeInput("", 1, 10, 4)).toEqual({
      value: 4,
      isValid: true,
    })
    expect(parseIntegerRangeInput("12x", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
    expect(parseIntegerRangeInput("0", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
    expect(parseIntegerRangeInput("11", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
    expect(
      parseIntegerRangeInput("9007199254740992", 1, Number.MAX_SAFE_INTEGER, 4)
    ).toEqual({ value: 4, isValid: false })
    expect(parseIntegerRangeInput("8", 1, 10, 4)).toEqual({
      value: 8,
      isValid: true,
    })
  })

  test("formats memory values", () => {
    expect(formatMemorySize(0)).toBe("0 KiB")
    expect(formatMemorySize(512)).toBe("512 KiB")
    expect(formatMemorySize(65536)).toBe("64 MiB")
    expect(formatMemorySize(1048576)).toBe("1 GiB")
  })
})
