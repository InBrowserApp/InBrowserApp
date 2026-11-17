import { describe, expect, test } from "vitest"
import { convert, type Request } from "./convert"
import {
  checkSize,
  formatBytes,
  MAX_BYTES,
  parseBytes,
  type Representation,
} from "./bytes"
import { fromJson, parseJson, projectJson } from "./typed-json"

const request: Request = {
  input: "null",
  format: "cbor",
  direction: "encode",
  representation: "hex",
  extended: false,
}
const encode = (input: string, options: Partial<Request> = {}) =>
  convert({ ...request, input, ...options })
const decode = (input: string, options: Partial<Request> = {}) =>
  encode(input, { direction: "decode", ...options })

describe("binary JSON conversion", () => {
  for (const format of ["cbor", "msgpack"] as const) {
    for (const representation of ["hex", "base64", "base64url"] as const) {
      test(`${format} ${representation} round trip`, () => {
        const input =
          '{"message":"Hi 世界 🌍","n":1.5,"items":[null,true,false,0,-1,200,65536],"nested":{"a":1}}'
        const encoded = encode(input, { format, representation })
        expect(
          JSON.parse(decode(encoded.text, { format, representation }).text)
        ).toEqual(JSON.parse(input))
        expect(encoded.bytes.length).toBeGreaterThan(0)
      })
    }
    for (const value of [
      "9007199254740993",
      "18446744073709551615",
      "-9223372036854775808",
    ]) {
      test(`${format} preserves ${value}`, () => {
        const encoded = encode(value, { format })
        expect(JSON.parse(decode(encoded.text, { format }).text)).toEqual({
          $integer: value,
        })
      })
    }
    for (const value of [
      { $binary: "AAH/" },
      { $binary: "" },
      { $integer: "9007199254740993" },
      { $float: "NaN" },
      { $float: "Infinity" },
      { $float: "-Infinity" },
      { $float: "-0" },
    ]) {
      test(`${format} typed ${JSON.stringify(value)}`, () => {
        const encoded = encode(JSON.stringify(value), {
          format,
          extended: true,
        })
        expect(JSON.parse(decode(encoded.text, { format }).text)).toEqual(value)
      })
    }
    test(`${format} wrapper collision remains literal`, () => {
      const encoded = encode('{"$integer":"ordinary text"}', { format })
      const decoded = decode(encoded.text, { format })
      expect(JSON.parse(decoded.text)).toEqual({
        $map: [["$integer", "ordinary text"]],
      })
      expect(encode(decoded.text, { format, extended: true }).text).toBe(
        encoded.text
      )
    })
    test(`${format} rejects truncated and trailing input`, () => {
      expect(() => decode(format === "cbor" ? "a1" : "81", { format })).toThrow(
        /./
      )
      expect(() => decode("00 00", { format })).toThrow(/./)
    })
    test(`${format} rejects duplicate keys`, () => {
      expect(() =>
        decode(
          format === "cbor" ? "a2 61 61 01 61 61 02" : "82 a1 61 01 a1 61 02",
          { format }
        )
      ).toThrow(/repeat|Duplicate/)
    })
  }
  test("literal wrapper-named fields do not change encoding traits", () => {
    const input = '{"$float":"-0","literal":true,"id":7}'
    const value = JSON.parse(input)
    expect(projectJson(value)).toEqual({
      value,
      typed: false,
      negativeZero: false,
    })
    const result = encode(input, { format: "msgpack" })
    expect(result.typed).toBe(false)
    expect(result.text.endsWith("a2 69 64 07")).toBe(true)
    expect(decode(result.text, { format: "msgpack" }).typed).toBe(false)
    expect(
      encode('{"literal":{"$float":"-0"},"id":7}', {
        format: "msgpack",
      }).text.endsWith("a2 69 64 07")
    ).toBe(true)
  })
  test("actual nested negative zero is detected while projecting once", () => {
    expect(projectJson({ items: [-0, Infinity] })).toEqual({
      value: { items: [{ $float: "-0" }, { $float: "Infinity" }] },
      typed: true,
      negativeZero: true,
    })
    const encoded = encode('{"items":[-0,1]}', { format: "msgpack" })
    expect(encoded.typed).toBe(true)
    expect(
      JSON.parse(decode(encoded.text, { format: "msgpack" }).text)
    ).toEqual({ items: [{ $float: "-0" }, 1] })
  })
  test("CBOR known RFC vector", () => {
    expect(encode('{"a":1,"b":[2,3]}').text).toBe("a2 61 61 01 61 62 82 02 03")
    expect(decode("9f 01 02 ff").text).toBe("[\n  1,\n  2\n]")
    expect(() => decode("61 ff")).toThrow(/UTF|utf/)
  })
  test("MessagePack known vector", () => {
    expect(encode('{"a":1}', { format: "msgpack" }).text).toBe("81 a1 61 01")
    expect(() => decode("81 01 02", { format: "msgpack" })).toThrow(
      /string keys/
    )
    expect(() => decode("c1", { format: "msgpack" })).toThrow(/./)
  })
  test("CBOR tags, undefined, non-string and reserved maps", () => {
    for (const value of [
      { $cborTag: [42, { $binary: "AQI=" }] },
      { $undefined: true },
      {
        $map: [
          [1, "one"],
          ["1", "string"],
        ],
      },
      { $map: [[{ nested: true }, [1, 2]]] },
    ]) {
      const encoded = encode(JSON.stringify(value), { extended: true })
      expect(JSON.parse(decode(encoded.text).text)).toEqual(value)
    }
  })
  test("rejects unsafe tag numbers and ill-formed Unicode", () => {
    expect(() => decode("db ff ff ff ff ff ff ff ff 00")).toThrow(/tag|Tag/)
    expect(() => encode('"\\ud800"')).toThrow(/Unicode/)
    expect(() => encode('{"\\ud800":1}')).toThrow(/Unicode/)
  })
  test("CBOR bignum tags stay explicit", () => {
    expect(JSON.parse(decode("c2 49 01 00 00 00 00 00 00 00 00").text)).toEqual(
      { $cborTag: [2, { $binary: "AQAAAAAAAAAA" }] }
    )
  })
  test("MessagePack extensions including timestamp stay raw", () => {
    for (const value of [
      { $msgpackExt: [5, "AQI="] },
      { $msgpackExt: [-1, "AAAAAA=="] },
      { $msgpackExt: [0, ""] },
    ]) {
      const encoded = encode(JSON.stringify(value), {
        format: "msgpack",
        extended: true,
      })
      expect(
        JSON.parse(decode(encoded.text, { format: "msgpack" }).text)
      ).toEqual(value)
    }
  })
  test("JSON parsing preserves keys and rejects duplicates/overflow", () => {
    expect(
      parseJson('{"__proto__":{"polluted":true},"constructor":1}')
    ).toEqual(JSON.parse('{"__proto__":{"polluted":true},"constructor":1}'))
    expect(() => parseJson('{"a":1,"a":2}')).toThrow(/Duplicate/)
    expect(() => parseJson("{")).toThrow(/./)
    expect(() => parseJson("1e999")).toThrow(/overflows/)
    expect(() => parseJson("1e-999")).toThrow(/underflows/)
    expect(parseJson("0.0")).toBe(0)
    expect(parseJson("-9007199254740993")).toBe(-9007199254740993n)
  })
  test("bounds binary and expanded JSON output", () => {
    expect(() => encode(JSON.stringify("a".repeat(MAX_BYTES - 2)))).toThrow(
      /1 MiB/
    )
    const input =
      "[".repeat(90) +
      JSON.stringify(Array.from({ length: 50000 }, () => 0)) +
      "]".repeat(90)
    expect(() => encode(input)).toThrow(/8 MiB/)
  })
  test("64-bit range checks apply to plain and typed input", () => {
    for (const format of ["cbor", "msgpack"] as const) {
      for (const input of [
        "18446744073709551616",
        "-18446744073709551617",
        '{"$integer":"18446744073709551616"}',
      ]) {
        expect(() => encode(input, { format, extended: true })).toThrow(
          /64-bit/
        )
      }
    }
    expect(encode("-18446744073709551616").text).toBe(
      "3b ff ff ff ff ff ff ff ff"
    )
  })
  test("validates typed wrappers", () => {
    for (const input of [
      '{"$binary":1}',
      '{"$integer":"01"}',
      '{"$float":"no"}',
      '{"$undefined":false}',
      '{"$cborTag":[-1,0]}',
      '{"$cborTag":[1]}',
      '{"$msgpackExt":[128,""]}',
      '{"$map":[[1]]}',
    ]) {
      expect(() => encode(input, { extended: true })).toThrow(/Invalid/)
    }
    expect(() =>
      encode('{"$map":[["a",1],["a",2]]}', { extended: true })
    ).toThrow(/Duplicate/)
    expect(() =>
      encode('{"$map":[[1,2]]}', { extended: true, format: "msgpack" })
    ).toThrow(/string keys/)
    expect(
      JSON.parse(
        decode(
          encode('{"$map":[["a",1]]}', { extended: true, format: "msgpack" })
            .text,
          { format: "msgpack" }
        ).text
      )
    ).toEqual({ a: 1 })
    expect(() =>
      encode('{"$undefined":true}', { extended: true, format: "msgpack" })
    ).toThrow(/incompatible/)
  })
  test("bounds input and nesting", () => {
    expect(() => encode('"' + "a".repeat(MAX_BYTES) + '"')).toThrow(/1 MiB/)
    expect(() => encode("[".repeat(102) + "0" + "]".repeat(102))).toThrow(/100/)
    expect(() =>
      decode("91 ".repeat(102) + "00", { format: "msgpack" })
    ).toThrow(/100/)
    expect(() => projectJson([0], 101)).toThrow(/100/)
    expect(() => fromJson(0, "cbor", false, 101)).toThrow(/100/)
  })
})

describe("byte representations", () => {
  for (const format of ["hex", "base64", "base64url"] as Representation[]) {
    test(`${format} round trips chunks and padding`, () => {
      for (const bytes of [
        new Uint8Array([0, 255, 254]),
        new Uint8Array([255]),
        new Uint8Array(10000).fill(128),
      ]) {
        expect(parseBytes(formatBytes(bytes, format), format)).toEqual(bytes)
      }
    })
  }
  test("hex whitespace and prefix", () =>
    expect(parseBytes("0X 00\nFF", "hex")).toEqual(new Uint8Array([0, 255])))
  test.each(["", "a", "xx", "0x", "01:"])("rejects invalid hex %s", (value) =>
    expect(() => parseBytes(value, "hex")).toThrow(/Hex/)
  )
  test.each(["", "A", "A===", "AA=", "A!AA", "AA-A", "AB=="])(
    "rejects invalid Base64 %s",
    (value) => expect(() => parseBytes(value, "base64")).toThrow(/Base64/)
  )
  test("Base64URL is explicit", () => {
    expect(() => parseBytes("++//", "base64url")).toThrow(/Base64/)
    expect(parseBytes("_w", "base64url")).toEqual(new Uint8Array([255]))
    expect(formatBytes(new Uint8Array(), "base64")).toBe("")
  })
  test("size guards", () => {
    expect(checkSize(MAX_BYTES)).toBeUndefined()
    expect(() => checkSize(MAX_BYTES + 1)).toThrow(/1 MiB/)
    expect(() => parseBytes(" ".repeat(MAX_BYTES * 3 + 17), "hex")).toThrow(
      /1 MiB/
    )
    expect(() => parseBytes("00".repeat(MAX_BYTES + 1), "hex")).toThrow(/1 MiB/)
    expect(() =>
      parseBytes("A".repeat(((MAX_BYTES + 2) / 3) * 4), "base64")
    ).toThrow(/1 MiB/)
  })
})
