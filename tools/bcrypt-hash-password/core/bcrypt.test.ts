import { describe, expect, test, vi } from "vitest"

import { generateBcryptHash, parseBcryptHash, parseCostInput } from "./bcrypt"

const SAMPLE_HASH =
  "$2b$12$abcdefghijklmnopqrstuuM6tV6dQe4hKpiu3wPjz9c2vY1a6b8cC"

describe("parseCostInput", () => {
  test("accepts an integer within the browser-safe cost range", () => {
    expect(parseCostInput("12")).toEqual({ value: 12, isValid: true })
  })

  test("rejects empty input", () => {
    expect(parseCostInput("", 10)).toEqual({ value: 10, isValid: false })
  })

  test("rejects non-integer input", () => {
    expect(parseCostInput("12.5", 10)).toEqual({
      value: 10,
      isValid: false,
    })
  })

  test("rejects values outside the allowed range", () => {
    expect(parseCostInput("3")).toEqual({ value: 12, isValid: false })
    expect(parseCostInput("16")).toEqual({ value: 12, isValid: false })
  })
})

describe("parseBcryptHash", () => {
  test("returns version, cost, salt, and checksum from a bcrypt hash", () => {
    expect(parseBcryptHash(SAMPLE_HASH)).toEqual({
      version: "2b",
      cost: 12,
      salt: "abcdefghijklmnopqrstuu",
      checksum: "M6tV6dQe4hKpiu3wPjz9c2vY1a6b8cC",
    })
  })

  test("returns null for malformed hashes", () => {
    expect(parseBcryptHash("not-a-bcrypt-hash")).toBeNull()
    expect(
      parseBcryptHash("$2b$12$abcdefghijklmnopqrstuuM6tV6dQe4hKpiu3wPjz9c2v")
    ).toBeNull()
  })
})

describe("generateBcryptHash", () => {
  test("delegates to bcrypt and returns parsed hash details", async () => {
    const hashFunction = vi.fn(async () => SAMPLE_HASH)

    await expect(
      generateBcryptHash("correct horse battery staple", 12, hashFunction)
    ).resolves.toEqual({
      hash: SAMPLE_HASH,
      parts: {
        version: "2b",
        cost: 12,
        salt: "abcdefghijklmnopqrstuu",
        checksum: "M6tV6dQe4hKpiu3wPjz9c2vY1a6b8cC",
      },
    })

    expect(hashFunction).toHaveBeenCalledWith(
      "correct horse battery staple",
      12
    )
  })

  test("rejects empty passwords", async () => {
    await expect(generateBcryptHash("", 12, vi.fn())).rejects.toThrow(
      "Enter a password"
    )
  })

  test("rejects invalid cost values before hashing", async () => {
    const hashFunction = vi.fn(async () => SAMPLE_HASH)

    await expect(
      generateBcryptHash("secret", 16, hashFunction)
    ).rejects.toThrow("Cost must be between")
    expect(hashFunction).not.toHaveBeenCalled()
  })

  test("rejects malformed output from the hashing implementation", async () => {
    await expect(
      generateBcryptHash(
        "secret",
        12,
        vi.fn(async () => "bad-output")
      )
    ).rejects.toThrow("valid bcrypt hash")
  })
})
