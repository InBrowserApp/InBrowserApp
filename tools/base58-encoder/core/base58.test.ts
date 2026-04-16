import { describe, expect, test } from "vitest"

import {
  BASE58_ALPHABETS,
  encodeBase58,
  getBase58Alphabet,
  isBase58AlphabetKey,
} from "./base58"

const encoder = new TextEncoder()
const BITCOIN_HELLO_WORLD = "JxF12TrwUP45BMd"

function remapAlphabet(
  value: string,
  fromAlphabet: string,
  toAlphabet: string
) {
  return [...value]
    .map((character) => {
      const index = fromAlphabet.indexOf(character)
      return index < 0 ? "" : toAlphabet[index]
    })
    .join("")
}

describe("encodeBase58", () => {
  test("encodes known values", () => {
    expect(encodeBase58(encoder.encode(""))).toBe("")
    expect(encodeBase58(encoder.encode("Hello World"))).toBe(
      BITCOIN_HELLO_WORLD
    )
    expect(encodeBase58(encoder.encode("hello world"))).toBe("StV1DL6CwTryKyV")
  })

  test("encodes ArrayBuffer input", () => {
    const bytes = encoder.encode("hello world")

    expect(encodeBase58(bytes.buffer)).toBe("StV1DL6CwTryKyV")
  })

  test("preserves leading zero bytes", () => {
    expect(encodeBase58(new Uint8Array([0]))).toBe("1")
    expect(encodeBase58(new Uint8Array([0, 0]))).toBe("11")
  })

  test("supports alternate alphabets", () => {
    const flickr = remapAlphabet(
      BITCOIN_HELLO_WORLD,
      BASE58_ALPHABETS.bitcoin,
      BASE58_ALPHABETS.flickr
    )
    const ripple = remapAlphabet(
      BITCOIN_HELLO_WORLD,
      BASE58_ALPHABETS.bitcoin,
      BASE58_ALPHABETS.ripple
    )

    expect(
      encodeBase58(encoder.encode("Hello World"), {
        alphabet: BASE58_ALPHABETS.flickr,
      })
    ).toBe(flickr)
    expect(
      encodeBase58(encoder.encode("Hello World"), {
        alphabet: BASE58_ALPHABETS.ripple,
      })
    ).toBe(ripple)
  })

  test("rejects invalid alphabets", () => {
    expect(() =>
      encodeBase58(encoder.encode("hello"), { alphabet: "123" })
    ).toThrow("Invalid Base58 alphabet")
    expect(() =>
      encodeBase58(encoder.encode("hello"), { alphabet: "1".repeat(58) })
    ).toThrow("Invalid Base58 alphabet")
  })
})

describe("base58 alphabets", () => {
  test("returns the alphabet for a known key", () => {
    expect(getBase58Alphabet("bitcoin")).toBe(BASE58_ALPHABETS.bitcoin)
  })

  test("detects valid alphabet keys", () => {
    expect(isBase58AlphabetKey("bitcoin")).toBe(true)
    expect(isBase58AlphabetKey("custom")).toBe(false)
  })
})
