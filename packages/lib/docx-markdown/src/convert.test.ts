import { afterEach, expect, test, vi } from "vitest"
import { zipSync } from "fflate"
import { convert } from "./convert"
import { failure } from "./errors"
import type { Labels } from "./types"

const mock = vi.hoisted(() => ({ load: vi.fn(), destroy: vi.fn() }))
vi.mock("@silurus/ooxml/docx", () => ({ DocxDocument: { load: mock.load } }))
const labels = {} as Labels
const model = {
  body: [{ type: "paragraph", runs: [{ type: "text", text: "Hello 中文" }] }],
  headers: {},
  footers: {},
}
afterEach(() => vi.resetAllMocks())
const archive = () =>
  zipSync({
    "[Content_Types].xml": new Uint8Array(),
    "word/document.xml": new Uint8Array(),
  })

test("parses modern Word files without product quotas and releases the parser", async () => {
  mock.load.mockResolvedValue({ document: model, destroy: mock.destroy })
  for (const name of [
    "document.docx",
    "macros.docm",
    "template.DOTX",
    "macro-template.dotm",
  ]) {
    const result = await convert({
      source: { file: new File([archive()], name) },
      labels,
    })
    expect(result).toEqual({ text: "Hello 中文\n" })
  }
  expect(mock.load).toHaveBeenCalledWith(expect.any(ArrayBuffer), {
    useGoogleFonts: false,
    mode: "main",
    resourceLimits: {
      maxArchiveEntryBytes: null,
      maxTotalInflatedBytes: null,
      maxArchiveEntries: null,
    },
  })
  expect(mock.destroy).toHaveBeenCalledTimes(4)
})

test("rejects unrelated, malformed and protected containers before loading", async () => {
  for (const file of [
    new File([archive()], "bad.doc"),
    new File(["text"], "bad.docx"),
    new File([zipSync({})], "empty.docx"),
    new File([zipSync({ "other.xml": new Uint8Array() })], "other.docx"),
    new File([new Uint8Array([80, 75, 3, 4])], "truncated.docx"),
  ])
    expect(await convert({ source: { file }, labels })).toEqual({
      error: "invalid",
    })
  expect(
    await convert({
      source: {
        file: new File(
          [new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])],
          "secret.docx"
        ),
      },
      labels,
    })
  ).toEqual({ error: "protected" })
  expect(mock.load).not.toHaveBeenCalled()
})

test("reports parse/resource failures, cleans up invalid models and reuses viewer models", async () => {
  const file = new File([archive()], "test.docx")
  mock.load.mockRejectedValueOnce(new RangeError("out of memory"))
  expect(await convert({ source: { file }, labels })).toEqual({
    error: "resource",
  })
  mock.load.mockResolvedValueOnce({
    document: { ...model, parseError: "bad" },
    destroy: mock.destroy,
  })
  expect(await convert({ source: { file }, labels })).toEqual({
    error: "invalid",
  })
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(await convert({ source: { model: model as never }, labels })).toEqual({
    text: "Hello 中文\n",
  })
  expect(mock.load).toHaveBeenCalledTimes(2)
  for (const [reason, expected] of [
    [null, "invalid"],
    [new Error("password required"), "protected"],
    [new Error("noText"), "noText"],
    [new Error("fetch failed"), "engineUnavailable"],
    [new Error("bad XML"), "invalid"],
    [new Error("resource"), "resource"],
  ] as const)
    expect(failure(reason)).toBe(expected)
})
