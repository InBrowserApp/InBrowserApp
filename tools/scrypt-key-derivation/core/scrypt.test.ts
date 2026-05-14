import { describe, expect, test } from "vitest"

import {
  MAX_SCRYPT_COST_BLOCK_PRODUCT,
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  decodeHex,
  deriveScrypt,
  estimateScryptMemoryBytes,
  formatDerivedKey,
  generateRandomSalt,
  getMaxCostFactorForBlockSize,
  isPowerOfTwo,
  isScryptMemoryWithinLimit,
  isValidBase64,
  isValidHex,
  normalizeBase64Input,
  parseCostFactorInput,
  parseIntegerRangeInput,
  saltToBytes,
} from "./scrypt"

describe("deriveScrypt", () => {
  test("derives a key from a UTF-8 salt", async () => {
    const derivedKey = await deriveScrypt({
      password: "hunter2",
      salt: "pepper",
      saltFormat: "utf-8",
      costFactor: 16,
      blockSize: 1,
      parallelism: 1,
      lengthBytes: 16,
    })

    expect(derivedKey).toEqual({
      hex: "1cf4f2f8d64da16e2ce041bc7c93c2a2",
      base64: "HPTy+NZNoW4s4EG8fJPCog==",
    })
  })

  test("derives a key from raw file bytes regardless of the selected salt format", async () => {
    const derivedKey = await deriveScrypt({
      password: "hunter2",
      salt: new Blob(["raw-salt-bytes"]),
      saltFormat: "hex",
      costFactor: 16,
      blockSize: 1,
      parallelism: 1,
      lengthBytes: 16,
    })

    expect(derivedKey).toEqual({
      hex: "1d7eff59a31d7638bb5c88153274eeee",
      base64: "HX7/WaMddji7XIgVMnTu7g==",
    })
  })

  test("rejects invalid parameter combinations", async () => {
    const baseParams = {
      password: "hunter2",
      salt: "pepper",
      saltFormat: "utf-8" as const,
      costFactor: 16,
      blockSize: 1,
      parallelism: 1,
      lengthBytes: 16,
    }

    await expect(
      deriveScrypt({ ...baseParams, costFactor: 15 })
    ).rejects.toThrow("N must be a power of 2.")
    await expect(deriveScrypt({ ...baseParams, blockSize: 0 })).rejects.toThrow(
      "Invalid scrypt parameters."
    )
    await expect(
      deriveScrypt({ ...baseParams, parallelism: 0 })
    ).rejects.toThrow("Invalid scrypt parameters.")
    await expect(
      deriveScrypt({ ...baseParams, lengthBytes: 0 })
    ).rejects.toThrow("Invalid scrypt parameters.")
    await expect(
      deriveScrypt({
        ...baseParams,
        costFactor: MAX_SCRYPT_COST_BLOCK_PRODUCT,
        blockSize: 2,
      })
    ).rejects.toThrow("scrypt parameters exceed the browser memory limit.")
  })
})

describe("salt helpers", () => {
  test("converts UTF-8, hex, base64, and file salt inputs into bytes", async () => {
    expect(await saltToBytes("Hi", "utf-8")).toEqual(Uint8Array.of(72, 105))
    expect(await saltToBytes("4869", "hex")).toEqual(Uint8Array.of(72, 105))
    expect(await saltToBytes("SGk", "base64")).toEqual(Uint8Array.of(72, 105))
    expect(await saltToBytes(new Blob(["Hi"]), "base64")).toEqual(
      Uint8Array.of(72, 105)
    )
  })

  test("formats derived bytes as hex and base64 output", () => {
    expect(formatDerivedKey(Uint8Array.of(72, 105))).toEqual({
      hex: "4869",
      base64: "SGk=",
    })
  })

  test("generates random salts in the selected format", () => {
    const randomSource = {
      getRandomValues: <T extends ArrayBufferView | null>(array: T) => {
        if (array instanceof Uint8Array) {
          array.set([0, 1, 2, 3])
        }
        return array
      },
      randomUUID: () =>
        "00000000-0000-4000-8000-000000000000" as `${string}-${string}-${string}-${string}-${string}`,
    }

    expect(generateRandomSalt("utf-8", 4, randomSource)).toBe(
      "00000000-0000-4000-8000-000000000000"
    )
    expect(generateRandomSalt("hex", 4, randomSource)).toBe("00010203")
    expect(generateRandomSalt("base64", 4, randomSource)).toBe("AAECAw==")
    expect(() => generateRandomSalt("hex", 4, null)).toThrow(
      "Random salt generation requires Web Crypto support."
    )
  })

  test("falls back to base64 text when randomUUID is unavailable", () => {
    const randomSource = {
      getRandomValues: <T extends ArrayBufferView | null>(array: T) => {
        if (array instanceof Uint8Array) {
          array.set([0, 1, 2])
        }
        return array
      },
    }

    expect(generateRandomSalt("utf-8", 3, randomSource)).toBe("AAEC")
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

  test("validates scrypt cost factor rules", () => {
    expect(parseCostFactorInput("16", 2, 1024, 16, 8)).toEqual({
      value: 16,
      isValid: true,
      error: "",
    })
    expect(parseCostFactorInput("1", 2, 1024, 16, 8)).toMatchObject({
      isValid: false,
      error: "range",
    })
    expect(parseCostFactorInput("24", 2, 1024, 16, 8)).toMatchObject({
      isValid: false,
      error: "power",
    })
    expect(
      parseCostFactorInput(
        String(MAX_SCRYPT_COST_BLOCK_PRODUCT),
        2,
        MAX_SCRYPT_COST_BLOCK_PRODUCT,
        16,
        2
      )
    ).toMatchObject({ isValid: false, error: "memory" })
  })

  test("computes power-of-two and memory constraints", () => {
    expect(isPowerOfTwo(16)).toBe(true)
    expect(isPowerOfTwo(1)).toBe(false)
    expect(isPowerOfTwo(24)).toBe(false)
    expect(isScryptMemoryWithinLimit(16, 8)).toBe(true)
    expect(isScryptMemoryWithinLimit(0, 8)).toBe(false)
    expect(isScryptMemoryWithinLimit(16, 0)).toBe(false)
    expect(estimateScryptMemoryBytes(16, 8)).toBe(16384)
    expect(estimateScryptMemoryBytes(16.5, 8)).toBe(0)
    expect(estimateScryptMemoryBytes(16, 0)).toBe(0)
    expect(getMaxCostFactorForBlockSize(8)).toBe(
      Math.floor(MAX_SCRYPT_COST_BLOCK_PRODUCT / 8)
    )
    expect(getMaxCostFactorForBlockSize(0)).toBe(0)
  })
})

describe("base64 helpers", () => {
  test("normalizes whitespace and URL-safe base64 characters", () => {
    expect(normalizeBase64Input("SGVsbG8_\n-")).toBe("SGVsbG8/+")
  })

  test("decodes valid base64 strings", () => {
    expect(decodeBase64("SGVsbG8=")).toEqual(
      Uint8Array.from(Buffer.from("Hello"))
    )
  })

  test("returns an empty byte array for empty base64 input", () => {
    expect(decodeBase64("")).toEqual(new Uint8Array())
  })

  test("rejects invalid base64 lengths and malformed input", () => {
    expect(() => decodeBase64("abcde")).toThrow("Invalid base64 length.")
    expect(() => decodeBase64("!!!!")).toThrow("Invalid base64 input.")
  })

  test("reports whether a base64 string is valid", () => {
    expect(isValidBase64("SGVsbG8=")).toBe(true)
    expect(isValidBase64("")).toBe(true)
    expect(isValidBase64("!!!!")).toBe(false)
  })
})

describe("hex helpers", () => {
  test("decodes valid hex strings", () => {
    expect(decodeHex("48656c6c6f")).toEqual(
      Uint8Array.from(Buffer.from("Hello"))
    )
  })

  test("returns an empty byte array for empty hex input", () => {
    expect(decodeHex("")).toEqual(new Uint8Array())
  })

  test("rejects odd-length and non-hex input", () => {
    expect(() => decodeHex("abc")).toThrow("Invalid hexadecimal input.")
    expect(() => decodeHex("zz")).toThrow("Invalid hexadecimal input.")
  })

  test("reports whether a hex string is valid", () => {
    expect(isValidHex("48656c6c6f")).toBe(true)
    expect(isValidHex("")).toBe(true)
    expect(isValidHex("abc")).toBe(false)
  })

  test("converts bytes to hex and base64 strings", () => {
    const bytes = Uint8Array.of(0, 255, 16)

    expect(bytesToHex(bytes)).toBe("00ff10")
    expect(bytesToBase64(bytes)).toBe("AP8Q")
  })
})
