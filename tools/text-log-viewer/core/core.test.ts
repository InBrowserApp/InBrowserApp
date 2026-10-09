import { Blob } from "node:buffer"
import { expect, test, vi } from "vitest"
import { TextIndex, floorIndex } from "./text-index"
import { find } from "./search"
import { decode, failure } from "./decode"
import { sectionHtml, escape } from "./section-html"
const indexOf = (...chunks: string[]) => {
  const index = new TextIndex()
  chunks.forEach((chunk) => index.add(chunk))
  index.finish()
  return index
}
const blob = (data: number[] | string) =>
  new Blob([
    typeof data === "string" ? data : Uint8Array.from(data),
  ]) as unknown as globalThis.Blob

test("preserves mixed line endings, tabs, blank lines, final empty line and chunk-boundary CRLF", () => {
  const index = indexOf("\tfirst\r", "\n\r\n", "third\rfourth\n")
  expect(index.read(0, index.length)).toBe("\tfirst\r\n\r\nthird\rfourth\n")
  expect(index.section(0).rows.map((row) => row.text)).toEqual([
    "\tfirst",
    "",
    "third",
    "fourth",
    "",
  ])
  expect(index.lines).toEqual([0, 8, 10, 16, 23])
  expect(index.section(-9).index).toBe(0)
  expect(index.section(900).index).toBe(0)
  expect(index.read(1, 4)).toBe("fir")
  expect(floorIndex([0, 2, 5], -1)).toBe(0)
  expect(floorIndex([0, 2, 5], 3)).toBe(1)
  expect(floorIndex([], 1)).toBe(0)
  expect(indexOf("").section(0).rows).toEqual([
    { line: 1, offset: 0, text: "", continued: false },
  ])
  expect(() => indexOf("text\0binary")).toThrow("BINARY")
})

test("sections bound DOM work without capping lines or characters or splitting surrogate pairs", () => {
  const many = indexOf(
    Array.from({ length: 1001 }, (_, i) => `line ${i}`).join("\n")
  )
  expect(many.lines).toHaveLength(1001)
  expect(many.sections).toHaveLength(4)
  expect(many.section(0).rows).toHaveLength(256)
  expect(many.section(3).rows.at(-1)?.text).toBe("line 1000")
  expect(many.at(many.lines[800]!).rows.some((row) => row.line === 801)).toBe(
    true
  )
  const long = indexOf("a".repeat(32767) + "😀" + "z".repeat(40000))
  expect(long.sections).toEqual([0, 32769, 65537])
  const sections = long.sections.map((_, i) => long.section(i))
  expect(
    sections
      .flatMap((section) => section.rows)
      .map((row) => row.text)
      .join("")
  ).toBe(long.read(0, long.length))
  expect(sections[1]?.rows[0]?.continued).toBe(true)
  expect(sections[0]?.rows[0]?.text.endsWith("😀")).toBe(true)
  const crlf = indexOf("x".repeat(32767) + "\r\nend")
  expect(crlf.sections).toEqual([0, 32769])
  expect(crlf.section(1).rows[0]?.text).toBe("end")
  expect(indexOf("x".repeat(32767) + "\uD800x").sections[1]).toBe(32768)
})

test("searches every chunk with literal case sensitivity, overlap, wrap and previous/next", async () => {
  const index = indexOf("ab", "aba", "\r", "\ntar", "get 😀 finish")
  const search = (query: string, from = 0, direction: 1 | -1 = 1) =>
    find(index, query, from, direction, () => false)
  expect(await search("aba")).toMatchObject({
    offset: 0,
    line: 1,
    wrapped: false,
  })
  expect(await search("aba", 1)).toMatchObject({ offset: 2, wrapped: false })
  expect(await search("aba", 3)).toMatchObject({ offset: 0, wrapped: true })
  expect(await search("aba", 1, -1)).toMatchObject({
    offset: 0,
    wrapped: false,
  })
  expect(await search("aba", -1, -1)).toMatchObject({
    offset: 2,
    wrapped: true,
  })
  expect(await search("target")).toMatchObject({ offset: 7, line: 2 })
  expect(await search("😀")).toMatchObject({ length: 2 })
  expect(await search("\r\ntarget")).toMatchObject({ offset: 5 })
  expect(await search("Target")).toBeNull()
  expect(await search("")).toBeNull()
  expect(
    await find(indexOf("aabaabaaaabaab"), "aabaab", 1, 1, () => false)
  ).toMatchObject({ offset: 8 })
  expect(await find(indexOf(), "a", 0, -1, () => false)).toBeNull()
  const cancel = vi.fn().mockReturnValueOnce(false).mockReturnValue(true)
  await expect(
    find(indexOf(...Array.from({ length: 20 }, () => "x")), "z", 0, 1, cancel)
  ).rejects.toMatchObject({ name: "AbortError" })
})

test("strictly decodes Unicode BOMs and representative legacy encodings", async () => {
  for (const [bytes, encoding, text] of [
    [[0xef, 0xbb, 0xbf, 65], "auto", "A"],
    [[0xff, 0xfe, 65, 0], "auto", "A"],
    [[0xfe, 0xff, 0, 65], "auto", "A"],
    [[65, 0, 66, 0], "utf-16le", "AB"],
    [[0, 65, 0, 66], "utf-16be", "AB"],
    [[0x63, 0x61, 0x66, 0xe9, 0x20, 0x80], "windows-1252", "café €"],
    [[0xcf, 0xf0, 0xe8, 0xe2, 0xe5, 0xf2], "windows-1251", "Привет"],
    [[0x93, 0xfa, 0x96, 0x7b], "shift_jis", "日本"],
    [[0xd6, 0xd0, 0xce, 0xc4], "gb18030", "中文"],
  ] as const) {
    const result = await decode(blob([...bytes]), encoding)
    expect(result.index.read(0, result.index.length)).toBe(text)
  }
  expect((await decode(blob("hello"), "auto")).encoding).toBe("utf-8")
  expect((await decode(blob([]), "auto")).index.length).toBe(0)
  await expect(decode(blob([0xff]), "auto")).rejects.toBeInstanceOf(TypeError)
  await expect(decode(blob([0, 1]), "auto")).rejects.toThrow("BINARY")
  // One-byte stream chunks exercise multibyte and CRLF boundaries in TextDecoder.
  const bytes = new TextEncoder().encode("😀\r\nlast")
  const stream = new ReadableStream({
    start(controller) {
      for (const byte of bytes) controller.enqueue(Uint8Array.of(byte))
      controller.close()
    },
  })
  const split = {
    slice: () => blob([]),
    stream: () => stream,
  } as unknown as globalThis.Blob
  const result = await decode(split, "auto")
  expect(result.index.section(0).rows.map((row) => row.text)).toEqual([
    "😀",
    "last",
  ])
  expect(failure(new TypeError())).toBe("encodingError")
  expect(failure(new RangeError())).toBe("resourceLimit")
  expect(failure(new Error("allocation failed"))).toBe("resourceLimit")
  expect(failure(new Error("BINARY"))).toBe("binary")
  expect(failure(new Error("file unavailable"))).toBe("readError")
  expect(failure(null)).toBe("readError")
})

test("renders escaped literal content and only the intersecting part of an active match", () => {
  const section = indexOf('<script x="yes">& hi</script>\nother').section(0)
  const html = sectionHtml(
    section,
    { offset: 3, length: 5, line: 1, wrapped: false },
    'Continued "line"'
  )
  expect(html).toContain("&lt;sc<mark>ript </mark>")
  expect(html).not.toContain('<script x="yes">')
  expect(html).toContain("script-src 'none'")
  expect(
    sectionHtml({ index: 0, start: 0, end: 0, rows: [] }, null, "")
  ).toContain("width:calc(2ch + 16px)")
  expect(
    sectionHtml(
      { ...section, rows: [{ ...section.rows[0]!, line: 1000002 }] },
      null,
      ""
    )
  ).toContain("width:calc(8ch + 16px)")
  expect(escape('<>"&')).toBe("&lt;&gt;&quot;&amp;")
  expect(sectionHtml(section, null, "Continued")).not.toContain("<mark>")
  expect(
    sectionHtml(
      section,
      { offset: -2, length: 10, line: 1, wrapped: false },
      "Continued"
    )
  ).toContain("<mark>&lt;script ")
  expect(
    sectionHtml(
      {
        index: 1,
        start: 10,
        end: 12,
        rows: [{ line: 1, offset: 10, text: "ok", continued: true }],
      },
      undefined,
      'Continued "line"'
    )
  ).toContain('title="Continued &quot;line&quot;"')
})
