import { pbkdf2Sync, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  decodeHex,
  derivePbkdf2,
  formatDerivedKey,
  isValidBase64,
  isValidHex,
  normalizeBase64Input,
  parseIntegerRangeInput,
  saltToBytes,
} from "./pbkdf2"

function toNodeDigestName(algorithm: string) {
  return algorithm.toLowerCase().replace("-", "")
}

describe("derivePbkdf2", () => {
  test.each(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const)(
    "derives a %s key from a UTF-8 salt",
    async (hash) => {
      const subtle = webcrypto.subtle as unknown as Pick<
        SubtleCrypto,
        "importKey" | "deriveBits"
      >

      const derivedKey = await derivePbkdf2(
        {
          password: "hunter2",
          salt: "pepper",
          saltFormat: "utf-8",
          iterations: 2,
          lengthBytes: 16,
          hash,
        },
        subtle
      )

      const expected = pbkdf2Sync(
        "hunter2",
        Buffer.from("pepper", "utf8"),
        2,
        16,
        toNodeDigestName(hash)
      )

      expect(derivedKey).toEqual({
        hex: expected.toString("hex"),
        base64: expected.toString("base64"),
      })
    }
  )

  test("derives a key from raw file bytes regardless of the selected salt format", async () => {
    const subtle = webcrypto.subtle as unknown as Pick<
      SubtleCrypto,
      "importKey" | "deriveBits"
    >

    const derivedKey = await derivePbkdf2(
      {
        password: "hunter2",
        salt: new Blob(["raw-salt-bytes"]),
        saltFormat: "hex",
        iterations: 2,
        lengthBytes: 16,
        hash: "SHA-256",
      },
      subtle
    )

    const expected = pbkdf2Sync(
      "hunter2",
      Buffer.from("raw-salt-bytes"),
      2,
      16,
      "sha256"
    )

    expect(derivedKey).toEqual({
      hex: expected.toString("hex"),
      base64: expected.toString("base64"),
    })
  })

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      derivePbkdf2(
        {
          password: "hunter2",
          salt: "pepper",
          saltFormat: "utf-8",
          iterations: 2,
          lengthBytes: 16,
          hash: "SHA-256",
        },
        null as unknown as Pick<SubtleCrypto, "importKey" | "deriveBits">
      )
    ).rejects.toThrow("PBKDF2 key derivation requires Web Crypto support.")
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

  test("converts bytes to hex and base64 strings", () => {
    const bytes = Uint8Array.of(0, 255, 16)

    expect(bytesToHex(bytes)).toBe("00ff10")
    expect(bytesToBase64(bytes)).toBe("AP8Q")
  })
})

describe("parseIntegerRangeInput", () => {
  test("accepts an empty string and falls back to the default", () => {
    expect(parseIntegerRangeInput("", 1, 10, 4)).toEqual({
      value: 4,
      isValid: true,
    })
  })

  test("rejects non-digit characters", () => {
    expect(parseIntegerRangeInput("12x", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
  })

  test("rejects numbers outside the allowed range", () => {
    expect(parseIntegerRangeInput("0", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
    expect(parseIntegerRangeInput("11", 1, 10, 4)).toEqual({
      value: 4,
      isValid: false,
    })
  })

  test("rejects unsafe integers", () => {
    expect(
      parseIntegerRangeInput("9007199254740992", 1, Number.MAX_SAFE_INTEGER, 4)
    ).toEqual({
      value: 4,
      isValid: false,
    })
  })

  test("accepts whole numbers inside the allowed range", () => {
    expect(parseIntegerRangeInput("8", 1, 10, 4)).toEqual({
      value: 8,
      isValid: true,
    })
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

  test("rejects invalid base64 lengths", () => {
    expect(() => decodeBase64("abcde")).toThrow("Invalid base64 length.")
  })

  test("rejects malformed base64 input", () => {
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

  test("rejects odd-length hex input", () => {
    expect(() => decodeHex("abc")).toThrow("Invalid hexadecimal input.")
  })

  test("rejects non-hex characters", () => {
    expect(() => decodeHex("zz")).toThrow("Invalid hexadecimal input.")
  })

  test("reports whether a hex string is valid", () => {
    expect(isValidHex("48656c6c6f")).toBe(true)
    expect(isValidHex("")).toBe(true)
    expect(isValidHex("abc")).toBe(false)
  })
})
