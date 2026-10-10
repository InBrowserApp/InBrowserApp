import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { prepareDocument } from "./convert"

const engine = vi.hoisted(() => ({ inspect: vi.fn(), convert: vi.fn() }))
vi.mock("caj2pdf-rust/browser", () => ({
  ...engine,
  MAX_ALLOCATION_LIMIT: 268435456n,
  MAX_U64: 18446744073709551615n,
}))
const report = {
  format: "caj",
  pagesConverted: 1001,
  omittedPages: [],
  bookmarksWritten: 2,
  outlineWarnings: 0,
  outlineOmitted: false,
  substitutedGlyphs: 0n,
  inputBytesRead: 5n,
  outputBytesWritten: 5n,
}
const file = new File(["CAJ"], "paper.caj")

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("wasm")))
  vi.spyOn(WebAssembly, "compileStreaming").mockResolvedValue(
    {} as WebAssembly.Module
  )
  engine.inspect.mockResolvedValue({ format: "caj", pageCount: 1001 })
  engine.convert.mockImplementation(async (_wasm, _file, sink, options) => {
    expect(await sink.writeChunk(new Uint8Array([37, 80, 68, 70, 45]))).toBe(5)
    await sink.flush()
    options.progress(1)
    return report
  })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("prepares all pages without imposing default byte/page quotas", async () => {
  const progress = vi.fn()
  const result = await prepareDocument(
    file,
    new AbortController().signal,
    progress
  )
  expect(await result.file.text()).toBe("%PDF-")
  expect(result.report).toEqual(report)
  expect(progress.mock.calls).toEqual([[null], [1]])
  expect(engine.convert).toHaveBeenCalledWith(
    expect.anything(),
    file,
    expect.anything(),
    expect.objectContaining({
      allowDamaged: false,
      includeBookmarks: true,
      limits: {
        maxPages: 0xffffffff,
        maxBookmarks: 0xffffffff,
        maxInputBytes: 18446744073709551615n,
        maxOutputBytes: 18446744073709551615n,
        maxAllocationBytes: 268435456n,
      },
    })
  )
})

test("distinguishes reference descriptors and incomplete documents", async () => {
  engine.inspect.mockResolvedValueOnce({ format: "caa", pageCount: null })
  await expect(
    prepareDocument(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("REFERENCE_ONLY")
  expect(engine.convert).not.toHaveBeenCalled()
  for (const update of [
    { pagesConverted: 0 },
    { pagesConverted: 1000 },
    { omittedPages: [{ pageIndex: 0, offset: 1n }] },
  ]) {
    engine.convert.mockResolvedValueOnce({ ...report, ...update })
    await expect(
      prepareDocument(file, new AbortController().signal, vi.fn())
    ).rejects.toThrow("MISSING_PAGES")
  }
  engine.inspect.mockResolvedValueOnce({ format: "kdh", pageCount: null })
  await expect(
    prepareDocument(file, new AbortController().signal, vi.fn())
  ).resolves.toHaveProperty("report", report)
})

test("reports loading failures and stops aborted work before retaining output", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }))
  await expect(
    prepareDocument(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("ENGINE_UNAVAILABLE")
  const aborted = new AbortController()
  aborted.abort()
  await expect(prepareDocument(file, aborted.signal, vi.fn())).rejects.toThrow(
    /abort/i
  )
  const during = new AbortController()
  vi.mocked(fetch).mockImplementationOnce(async () => {
    during.abort()
    throw new Error("network")
  })
  await expect(prepareDocument(file, during.signal, vi.fn())).rejects.toThrow(
    /abort/i
  )
  const writing = new AbortController()
  engine.convert.mockImplementationOnce(async (_wasm, _file, sink) => {
    writing.abort()
    await sink.writeChunk(new Uint8Array([1]))
    return report
  })
  await expect(prepareDocument(file, writing.signal, vi.fn())).rejects.toThrow(
    /abort/i
  )
})
