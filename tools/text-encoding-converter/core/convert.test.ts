import { describe, expect, it } from "vitest"
import iconv from "iconv-lite"
import { ENCODINGS, PREVIEW_LENGTH } from "../config"
import { convertInput, normalizeLineEndings, outputHasBom } from "./convert"
import { compareEncodings, decode, lineEndings, preview } from "./decode"
import type { LineEnding } from "../config"

const defaults = {
  source: "auto",
  target: "utf-8",
  bom: "remove",
  lineEnding: "preserve",
} as const
const utf8 = (text: string) => new TextEncoder().encode(text)
const bytesOf = (bytes: ArrayBuffer | null) =>
  Array.from(new Uint8Array(bytes!))

describe("file decoding", () => {
  it("reads valid UTF-8 and does not treat literal replacement characters as decoder failures", () => {
    expect(decode(utf8("Hello 中文 😀 �"), "auto")).toEqual({
      text: "Hello 中文 😀 �",
      encoding: "utf-8",
      bom: null,
      error: null,
    })
  })
  it.each([
    ["utf-8", [0xef, 0xbb, 0xbf]],
    ["utf-16le", [0xff, 0xfe]],
    ["utf-16be", [0xfe, 0xff]],
  ] as const)(
    "detects %s BOM and removes exactly one signature",
    (encoding, bom) => {
      const bytes = new Uint8Array([
        ...bom,
        ...iconv.encode("\ufeffA😀", encoding),
      ])
      const result = decode(bytes, "auto")
      expect(result).toEqual({
        encoding,
        bom: encoding,
        text: "\ufeffA😀",
        error: null,
      })
      expect(decode(bytes, encoding)).toEqual(result)
    }
  )
  it.each([
    [0, 0, 0xfe, 0xff],
    [0xff, 0xfe, 0, 0],
  ])(
    "rejects UTF-32 before testing overlapping UTF-16 signatures: %j",
    (...bom) => {
      expect(decode(new Uint8Array([...bom, 65, 0, 0, 0]), "auto").error).toBe(
        "unsupportedBom"
      )
      expect(decode(new Uint8Array(bom), "utf-16le").error).toBe(
        "unsupportedBom"
      )
    }
  )
  it("keeps the original bytes when an explicit choice conflicts with the BOM", () => {
    expect(
      decode(new Uint8Array([0xef, 0xbb, 0xbf, 65]), "windows-1252")
    ).toMatchObject({ text: "ï»¿A", bom: "utf-8", error: "bomMismatch" })
  })
  it("requires a source choice for invalid BOM-less UTF-8", () => {
    const bytes = new Uint8Array([0xd6, 0xd0, 0xce, 0xc4])
    expect(decode(bytes, "auto").error).toBe("sourceUnknown")
    expect(decode(bytes, "gbk")).toMatchObject({ text: "中文", error: null })
  })
  it.each([
    ["utf-8", [0xc0, 0xaf]],
    ["utf-8", [0xef, 0xbb, 0xbf, 0xe4]],
    ["utf-16le", [0xff, 0xfe, 65]],
    ["gbk", [0x81]],
    ["big5", [0x81]],
    ["shift_jis", [0x82]],
  ] as const)(
    "prevents damaged %s from being silently exported",
    (encoding, bytes) => {
      const result = convertInput(new Uint8Array(bytes), {
        ...defaults,
        source: encoding,
      })
      expect(result.error).toBe("invalidBytes")
      expect(result.bytes).toBeNull()
      expect(result.sourcePreview).toContain("�")
    }
  )
  it("rejects binary controls but preserves tabs and ordinary whitespace", () => {
    expect(decode(utf8("\u0000"), "auto").error).toBe("binary")
    expect(decode(utf8("a\t b\n\r\f"), "auto").error).toBeNull()
    expect(convertInput("\u0000", defaults).error).toBe("binary")
  })
  it("offers independent source previews without corrupting a partial multibyte ending", () => {
    const input = new Uint8Array([...utf8("A".repeat(4095)), ...utf8("中")])
    const candidates = compareEncodings(input)
    expect(candidates).toHaveLength(5)
    expect(candidates[0]!.preview).not.toContain("�")
    expect(compareEncodings(utf8("中文"))[0]!.preview).toBe("中文")
  })
})

describe("actual output bytes", () => {
  it.each([
    [
      "utf-8",
      "中文😀",
      [0xe4, 0xb8, 0xad, 0xe6, 0x96, 0x87, 0xf0, 0x9f, 0x98, 0x80],
    ],
    ["gbk", "中文", [0xd6, 0xd0, 0xce, 0xc4]],
    ["big5", "中文", [0xa4, 0xa4, 0xa4, 0xe5]],
    ["utf-16le", "A😀", [65, 0, 0x3d, 0xd8, 0, 0xde]],
    ["utf-16be", "A😀", [0, 65, 0xd8, 0x3d, 0xde, 0]],
    ["windows-1252", "Café €", [67, 97, 102, 0xe9, 32, 0x80]],
  ] as const)(
    "writes independent known %s byte vectors",
    (target, text, bytes) => {
      const result = convertInput(text, { ...defaults, target })
      expect(result.error).toBeNull()
      expect(bytesOf(result.bytes)).toEqual(bytes)
      expect(result.outputPreview).toBe(text)
    }
  )
  it.each([
    ["gb18030", "中文𠮷😀"],
    ["shift_jis", "日本語"],
    ["euc-jp", "日本語"],
    ["euc-kr", "한국어"],
    ["windows-1251", "Привет"],
  ] as const)("round trips %s through actual source bytes", (target, text) => {
    const encoded = convertInput(text, { ...defaults, target })
    expect(encoded.error).toBeNull()
    const restored = convertInput(new Uint8Array(encoded.bytes!), {
      ...defaults,
      source: target,
    })
    expect(new TextDecoder().decode(restored.bytes!)).toBe(text)
  })
  it.each(ENCODINGS)(
    "supports %s without introducing a BOM or modifying ASCII",
    (target) => {
      const result = convertInput("ASCII\r\n\n", { ...defaults, target })
      expect(result.error).toBeNull()
      expect(result.outputBom).toBe(false)
      expect(result.outputPreview).toBe("ASCII\r\n\n")
    }
  )
  it.each(["gbk", "big5", "windows-1252"] as const)(
    "blocks unrepresentable Unicode in %s and retains diagnostic preview",
    (target) => {
      const result = convertInput("A😀中", { ...defaults, target })
      expect(result.error).toBe("unrepresentable")
      expect(result.bytes).toBeNull()
      expect(result.outputPreview).toContain("?")
    }
  )
  it("catches compatibility mappings and lone surrogates that change text", () => {
    expect(convertInput("¥", { ...defaults, target: "shift_jis" }).error).toBe(
      "unrepresentable"
    )
    expect(convertInput("\ud800", defaults).error).toBe("unrepresentable")
  })
  it("preserves literal ?, U+FFFD, markup, composed forms and a final newline", () => {
    const text = "<script>alert(1)</script> ? � e\u0301\r\n"
    const result = convertInput(text, defaults)
    expect(result.error).toBeNull()
    expect(new TextDecoder().decode(result.bytes!)).toBe(text)
  })
  it.each([
    ["utf-8", [0xef, 0xbb, 0xbf]],
    ["utf-16le", [0xff, 0xfe]],
    ["utf-16be", [0xfe, 0xff]],
  ] as const)("adds exactly one %s BOM", (target, signature) => {
    const result = convertInput("A", { ...defaults, target, bom: "add" })
    expect(bytesOf(result.bytes).slice(0, signature.length)).toEqual(signature)
    expect(new TextDecoder(target).decode(result.bytes!)).toBe("A")
    expect(result.outputBom).toBe(true)
  })
  it("can remove or match the input BOM across encoding changes", () => {
    expect(bytesOf(convertInput("\ufeffA", defaults).bytes)).toEqual([65])
    expect(
      bytesOf(
        convertInput("\ufeffA", {
          ...defaults,
          target: "utf-16be",
          bom: "preserve",
        }).bytes
      )
    ).toEqual([0xfe, 0xff, 0, 65])
    expect(
      bytesOf(convertInput("A", { ...defaults, bom: "preserve" }).bytes)
    ).toEqual([65])
    expect(outputHasBom("gbk", "add", true)).toBe(false)
    expect(outputHasBom("utf-8", "preserve", true)).toBe(true)
    expect(outputHasBom("utf-8", "preserve", false)).toBe(false)
  })
  it("supports empty files, including BOM-only output", () => {
    const result = convertInput(new Uint8Array(), defaults)
    expect(result.error).toBeNull()
    expect(result.bytes!.byteLength).toBe(0)
    expect(result.hex).toBe("")
    expect(
      bytesOf(convertInput("", { ...defaults, bom: "add" }).bytes)
    ).toEqual([0xef, 0xbb, 0xbf])
  })
  it("bounds display only while exporting the entire input", () => {
    const text = `${"a".repeat(PREVIEW_LENGTH + 300)}中文\n`
    const result = convertInput(text, defaults)
    expect(result.sourcePreview).toHaveLength(PREVIEW_LENGTH)
    expect(result.outputPreview).toHaveLength(PREVIEW_LENGTH)
    expect(new TextDecoder().decode(result.bytes!)).toBe(text)
    expect(result.hex.split(" ")).toHaveLength(64)
    expect(preview("😀", 1)).toBe("")
    expect(preview("A😀B", 3)).toBe("A😀")
  })
})

describe("line endings", () => {
  const input = "a\r\n\r\nb\nc\r\r"
  it("counts mixed line endings without double-counting CRLF", () => {
    expect(lineEndings(input)).toEqual({ crlf: 2, lf: 1, cr: 2 })
    expect(lineEndings("plain")).toEqual({ crlf: 0, lf: 0, cr: 0 })
  })
  it.each([
    ["preserve", input],
    ["lf", "a\n\nb\nc\n\n"],
    ["crlf", "a\r\n\r\nb\r\nc\r\n\r\n"],
    ["cr", "a\r\rb\rc\r\r"],
  ] as const)(
    "applies %s while retaining blank and final lines",
    (ending: LineEnding, expected) => {
      expect(normalizeLineEndings(input, ending)).toBe(expected)
      expect(
        new TextDecoder().decode(
          convertInput(input, { ...defaults, lineEnding: ending }).bytes!
        )
      ).toBe(expected)
    }
  )
  it("never appends a newline to text without one", () => {
    expect(normalizeLineEndings("last", "crlf")).toBe("last")
  })
})
