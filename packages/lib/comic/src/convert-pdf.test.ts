// @vitest-environment node
import { readFile } from "node:fs/promises"
import { PDFDocument } from "pdf-lib"
import { afterEach, expect, test, vi } from "vitest"
import { convertPdf } from "./convert-pdf"
import { ConversionError, conversionFailure, failureMessage } from "./errors"

const mock = vi.hoisted(() => ({ rasterize: vi.fn() }))
vi.mock("./rasterize", () => ({ rasterize: mock.rasterize }))
const png = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9f8AAAAASUVORK5CYII=",
    "base64"
  )
)
const signal = () => new AbortController().signal
async function fixture(name: string) {
  return new File(
    [await readFile(`tools/cbz-reader/fixtures/${name}.cbz`)],
    `${name}.cbz`
  )
}
afterEach(() => vi.resetAllMocks())

test("creates complete PDFs in the shared natural order without a page-count quota", async () => {
  mock.rasterize.mockImplementation(async () => ({
    width: 7,
    height: 10,
    bytes: png,
  }))
  const progress = vi.fn()
  const result = await convertPdf(await fixture("long"), signal(), progress)
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(pdf.getPageCount()).toBe(1201)
  expect(result.names.slice(0, 3)).toEqual([
    "page1.png",
    "page2.png",
    "page3.png",
  ])
  expect(result.names.at(-1)).toBe("page1201.png")
  expect(pdf.getPage(0).getSize()).toEqual({ width: 589.4, height: 842 })
  expect(progress).toHaveBeenLastCalledWith({
    page: 1201,
    total: 1201,
    name: "",
    saving: true,
  })
  expect(result.pdf.type).toBe("application/pdf")
}, 30000)

test("fits landscape artwork and preserves the archive source label", async () => {
  mock.rasterize.mockResolvedValue({ width: 1600, height: 800, bytes: png })
  const result = await convertPdf(
    await fixture("avif-compatible"),
    signal(),
    vi.fn()
  )
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(pdf.getPage(0).getSize()).toEqual({ width: 842, height: 421 })
  expect(result.names).toEqual(["page1.avif"])
})

test.each([
  ["empty", "empty", undefined],
  ["unsupported", "unsupportedPage", "page1.svg"],
  ["protected", "encryptedPage", "page1.png"],
  ["disguised-svg", "damagedPage", "page1.png"],
  ["representative", "damagedPage", "chapter2/page0.png"],
])(
  "rejects %s instead of emitting partial output",
  async (file, code, name) => {
    await expect(
      convertPdf(await fixture(file), signal(), vi.fn())
    ).rejects.toMatchObject({
      detail: { code, ...(name ? { page: 1, name } : {}) },
    })
  }
)

test("identifies decoder resource and engine failures with their page location", async () => {
  for (const [reason, code] of [
    [new RangeError("allocation"), "resourceLimit"],
    [new ConversionError({ code: "engineUnavailable" }), "engineUnavailable"],
    [new Error("decode"), "damagedPage"],
  ] as const) {
    mock.rasterize.mockRejectedValueOnce(reason)
    await expect(
      convertPdf(await fixture("avif-compatible"), signal(), vi.fn())
    ).rejects.toMatchObject({ detail: { code, page: 1, name: "page1.avif" } })
  }
})

test("cancellation rejects before a completed file can escape", async () => {
  const controller = new AbortController()
  mock.rasterize.mockImplementation(async () => {
    controller.abort()
    return { width: 7, height: 10, bytes: png }
  })
  await expect(
    convertPdf(await fixture("avif-compatible"), controller.signal, vi.fn())
  ).rejects.toThrow(/abort/i)
})

test("formats localized page failures literally, including replacement-like filenames", () => {
  const reason = new ConversionError({
    code: "damagedPage",
    page: 2,
    name: "$&/$`/$'.png",
  })
  const messages = {
    damagedPage: "Broken image",
    pageFailure: "Page {page}: {name}",
  } as Parameters<typeof failureMessage>[1]
  expect(failureMessage(reason, messages)).toBe(
    "Page 2: $&/$`/$'.png — Broken image"
  )
  expect(conversionFailure(new Error("password needed"))).toEqual({
    code: "encrypted",
  })
  expect(
    failureMessage(new Error("bad ZIP"), {
      damaged: "Invalid archive",
    } as typeof messages)
  ).toBe("Invalid archive")
})
