import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { imageSession } from "@workspace/raster-image"
import {
  createPageRenderer,
  getFileSignature,
  ImagePageError,
  readSourcePages,
  releasePages,
} from "./image-processing"
import type { ImageQueueItem } from "./types"
vi.mock("@workspace/raster-image", () => ({ imageSession: vi.fn() }))
const inspect = vi.fn()
const render = vi.fn()
const preview = {
  bytes: new Uint8Array([1]),
  mime: "image/png",
  width: 120,
  height: 192,
  fullWidth: 200,
  fullHeight: 320,
}
const file = new File(["image"], "pages.tiff", { lastModified: 123 })
let signals: AbortSignal[]
beforeEach(() => {
  signals = []
  inspect.mockReset().mockResolvedValue({
    count: 3,
    kind: "page",
    format: "TIFF",
    poster: false,
  })
  render.mockReset().mockResolvedValue(preview)
  vi.mocked(imageSession)
    .mockReset()
    .mockImplementation((_file, signal) => {
      signals.push(signal)
      return { inspect, render } as never
    })
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:thumb-${++id}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

test("retains every TIFF page and its original size, including a failed page", async () => {
  render.mockRejectedValueOnce(new Error("invalid"))
  const progress = vi.fn()
  const pages = await readSourcePages(
    file,
    new AbortController().signal,
    progress
  )
  expect(pages.map((p) => [p.sourceIndex, p.selected, p.failure])).toEqual([
    [0, true, "invalid"],
    [1, true, undefined],
    [2, true, undefined],
  ])
  expect(pages[1]).toMatchObject({
    width: 200,
    height: 320,
    previewUrl: "blob:thumb-1",
  })
  expect(progress.mock.calls).toEqual([
    [1, 3],
    [2, 3],
    [3, 3],
  ])
  expect(render).toHaveBeenCalledWith(2, undefined, { maxDimension: 192 })
  expect(signals[0]!.aborted).toBe(true)
  releasePages(pages)
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  expect(getFileSignature(file)).toBe("pages.tiff-5-123")
})

test("keeps source failures visible and releases failed worker construction", async () => {
  inspect.mockRejectedValueOnce(new Error("unsupported"))
  expect(
    await readSourcePages(file, new AbortController().signal, vi.fn())
  ).toMatchObject([{ info: null, failure: "unsupported", selected: true }])
  vi.mocked(imageSession).mockImplementationOnce((_file, signal) => {
    signals.push(signal)
    throw new Error("engineError")
  })
  expect(
    await readSourcePages(file, new AbortController().signal, vi.fn())
  ).toMatchObject([{ failure: "engineError" }])
  expect(signals.every((s) => s.aborted)).toBe(true)
})

test("aborts reads without publishing partial pages and revokes pending thumbnails", async () => {
  const controller = new AbortController()
  await expect(
    readSourcePages(file, controller.signal, () => controller.abort())
  ).rejects.toThrow(/abort/i)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:thumb-1")
  expect(signals[0]!.aborted).toBe(true)
  await expect(
    readSourcePages(file, controller.signal, vi.fn())
  ).rejects.toThrow(/abort/i)
  expect(imageSession).toHaveBeenCalledTimes(1)
})

test("loads full source pages sequentially, reuses one file and closes on source changes", async () => {
  const pages = await readSourcePages(
    file,
    new AbortController().signal,
    vi.fn()
  )
  const renderer = createPageRenderer(new AbortController().signal)
  render.mockClear()
  const first = await renderer.render({ ...pages[1]!, rotation: 90 }, "best")
  await renderer.render(pages[2]!, "small")
  expect(first).toEqual({ jpegBytes: preview.bytes, width: 120, height: 192 })
  expect(render.mock.calls).toEqual([
    [1, { quality: 92, background: "#ffffff" }, { rotation: 90 }],
    [2, { quality: 68, background: "#ffffff" }, { rotation: 0 }],
  ])
  expect(signals).toHaveLength(2)
  expect(signals[1]!.aborted).toBe(false)
  await renderer.render(
    { ...pages[0]!, file: new File(["new"], "new.png") },
    "balanced"
  )
  expect(signals[1]!.aborted).toBe(true)
  renderer.close()
  expect(signals.every((s) => s.aborted)).toBe(true)
  releasePages(pages)
})

test("identifies an export failure and stops cancelled export without wrapping the abort", async () => {
  const item = { file, sourceIndex: 2, rotation: 0 } as ImageQueueItem
  const controller = new AbortController()
  const renderer = createPageRenderer(controller.signal)
  render.mockRejectedValueOnce(new Error("resourceLimit"))
  await expect(renderer.render(item, "balanced")).rejects.toEqual(
    new ImagePageError(item, "resourceLimit")
  )
  controller.abort()
  await expect(renderer.render(item, "balanced")).rejects.toThrow(/abort/i)
  renderer.close()
  createPageRenderer(new AbortController().signal).close()
})
