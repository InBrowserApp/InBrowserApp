import { encode, ExtData } from "@msgpack/msgpack"
import { describe, expect, test } from "vitest"
import { parseBytes } from "./bytes"
import { decodeMessagePack } from "./messagepack"
import { parseJson } from "./typed-json"

const decodeHex = (hex: string) => decodeMessagePack(parseBytes(hex, "hex"))

describe("MessagePack string fidelity and map keys", () => {
  test.each(["0e1", "0e-1", "0.000e9", "0E99"])(
    "accepts zero exponent %s",
    (input) => {
      expect(parseJson(input)).toBe(0)
    }
  )
  test.each(["-0e20", "-0.00e-99"])("preserves signed zero %s", (input) => {
    expect(Object.is(parseJson(input), -0)).toBe(true)
  })
  test("preserves long BOM-prefixed text and literal prototype keys", () => {
    const text = "\uFEFF" + "世界".repeat(100)
    const value = Object.fromEntries([
      ["__proto__", { polluted: true }],
      ["constructor", "constructor"],
      ["prototype", "prototype"],
      ["toString", "toString"],
      ["long".repeat(100), text],
      ["", ""],
    ])
    const decoded = decodeMessagePack(encode(value))
    expect(decoded).toEqual(value)
    expect(Object.hasOwn(decoded as object, "__proto__")).toBe(true)
    expect(Object.getPrototypeOf(decoded)).toBe(Object.prototype)
  })
  test("preserves wire ordering of text, binary, maps, arrays and extensions", () => {
    const value = [
      "same",
      new TextEncoder().encode("same"),
      { nested: ["\uFEFF", new Uint8Array(), ""] },
      new ExtData(5, new Uint8Array([0xff])),
      [new Uint8Array([0xff]), "last"],
    ]
    expect(decodeMessagePack(encode(value))).toEqual(value)
    // Numeric-looking keys are reordered by normal JS objects, so decoding
    // must restore values while the temporary nonnumeric keys retain order.
    expect(decodeHex("82 a1 32 a1 6f a1 31 c4 01 ff")).toEqual({
      "1": new Uint8Array([255]),
      "2": "o",
    })
  })
  test.each([
    "a1 ff",
    "a1 c0",
    "a2 c0 80",
    "a3 ed a0 80",
    "a1 e2",
    "d9 01 ff",
    "da 00 01 ff",
    "db 00 00 00 01 ff",
    "81 a1 ff c0",
  ])("rejects invalid UTF-8 %s", (hex) => {
    expect(() => decodeHex(hex)).toThrow(/UTF|utf|encoded/)
  })
  test("rejects repeated prototype-named and empty keys", () => {
    expect(() =>
      decodeHex(
        "82 a9 5f 5f 70 72 6f 74 6f 5f 5f 01 a9 5f 5f 70 72 6f 74 6f 5f 5f 02"
      )
    ).toThrow(/Duplicate/)
    expect(() => decodeHex("82 a0 01 a0 02")).toThrow(/Duplicate/)
  })
})

describe("MessagePack wire families", () => {
  test.each([
    ["c0", null],
    ["c2", false],
    ["c3", true],
    ["7f", 127],
    ["ff", -1],
    ["ca 3f 80 00 00", 1],
    ["cb 3f f0 00 00 00 00 00 00", 1],
    ["cc 80", 128],
    ["cd 01 00", 256],
    ["ce 00 01 00 00", 65536],
    ["cf 00 00 00 01 00 00 00 00", 4294967296n],
    ["d0 df", -33],
    ["d1 ff 7f", -129],
    ["d2 ff ff 7f ff", -32769],
    ["d3 ff ff ff ff 7f ff ff ff", -2147483649n],
    ["c4 00", new Uint8Array()],
    ["c5 00 01 00", new Uint8Array([0])],
    ["c6 00 00 00 01 ff", new Uint8Array([255])],
    ["a0", ""],
    ["a1 61", "a"],
    ["d9 01 61", "a"],
    ["da 00 01 61", "a"],
    ["db 00 00 00 01 61", "a"],
    ["90", []],
    ["dc 00 01 a1 61", ["a"]],
    ["dd 00 00 00 01 a1 61", ["a"]],
    ["80", {}],
    ["81 a0 a0", { "": "" }],
    ["de 00 01 a1 6b a1 76", { k: "v" }],
    ["df 00 00 00 01 a1 6b a1 76", { k: "v" }],
  ] as const)("decodes %s", (hex, expected) => {
    expect(decodeHex(hex)).toEqual(expected)
  })
  test.each([
    "c7 01 01 ff",
    "c8 00 01 01 ff",
    "c9 00 00 00 01 01 ff",
    "d4 01 ff",
    "d5 01 ff ff",
    "d6 01 ff ff ff ff",
    "d7 01 ff ff ff ff ff ff ff ff",
    "d8 01 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff",
  ])("preserves extension bytes %s", (hex) => {
    const decoded = decodeHex(hex) as ExtData
    expect(decoded).toBeInstanceOf(ExtData)
    expect(decoded.type).toBe(1)
    expect(
      Array.from(decoded.data as Uint8Array).every((byte) => byte === 255)
    ).toBe(true)
  })
  test.each(["a1", "c4 01", "c8 00", "d4", "dc 00 01", "df ff ff ff ff"])(
    "rejects truncation %s",
    (hex) => {
      expect(() => decodeHex(hex)).toThrow(/Truncated/)
    }
  )
  test("rejects empty input, trailing values and reserved bytes", () => {
    expect(() => decodeMessagePack(new Uint8Array())).toThrow(/Truncated/)
    expect(() => decodeHex("00 00")).toThrow(/Trailing/)
    expect(() => decodeHex("c1")).toThrow(/Unrecognized/)
  })
})
