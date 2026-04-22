import { describe, expect, test } from "vitest"

import { encodeBase85, isBase85Variant } from "./base85"

const encoder = new TextEncoder()
const ASCII85_HELLO_WORLD = '87cURD]i,"Ebo7'
const ASCII85_HELLO_WORLD_LOWER = "BOu!rD]j7BEbo7"
const Z85_HELLO_WORLD = "nm=QNz=Z<$y?aXj"

describe("encodeBase85", () => {
  test("encodes ASCII85 values and shorthand", () => {
    expect(encodeBase85(encoder.encode(""))).toBe("")
    expect(encodeBase85(encoder.encode("Hello World"))).toBe(
      ASCII85_HELLO_WORLD
    )
    expect(encodeBase85(encoder.encode("hello world"))).toBe(
      ASCII85_HELLO_WORLD_LOWER
    )
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0]))).toBe("z")
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0, 0]))).toBe("z!!")
    expect(encodeBase85(encoder.encode("foo"))).toBe("AoDS")
  })

  test("encodes ArrayBuffer input", () => {
    const bytes = encoder.encode("foo")

    expect(encodeBase85(bytes.buffer)).toBe("AoDS")
  })

  test("encodes Z85 values", () => {
    expect(
      encodeBase85(encoder.encode("HelloWorld!!"), { variant: "z85" })
    ).toBe(Z85_HELLO_WORLD)
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0]), { variant: "z85" })).toBe(
      "00000"
    )
  })

  test("rejects Z85 input with invalid length", () => {
    expect(() =>
      encodeBase85(encoder.encode("hi"), { variant: "z85" })
    ).toThrow("Invalid Base85 length")
  })
})

describe("base85 variants", () => {
  test("detects valid variant keys", () => {
    expect(isBase85Variant("ascii85")).toBe(true)
    expect(isBase85Variant("z85")).toBe(true)
    expect(isBase85Variant("custom")).toBe(false)
  })
})
