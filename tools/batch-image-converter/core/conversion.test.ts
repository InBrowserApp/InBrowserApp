import { beforeEach, expect, test, vi } from "vitest"
import { imageSession } from "@workspace/raster-image"
import { convertFile } from "./conversion"

vi.mock("@workspace/raster-image", () => ({ imageSession: vi.fn() }))

const inspect = vi.fn()
const render = vi.fn()
const opened = { count: 1, format: "PNG", kind: "image", poster: false }
const preview = {
  bytes: Uint8Array.of(1, 2, 3),
  mime: "image/webp",
  width: 200,
  height: 100,
}
const image = new File(["input"], "picture.png")

beforeEach(() => {
  inspect.mockReset().mockResolvedValue(opened)
  render.mockReset().mockResolvedValue(preview)
  vi.mocked(imageSession).mockReset().mockReturnValue({
    inspect,
    render,
    open: vi.fn(),
  })
})

test("encodes each supported page and cleans up its worker", async () => {
  inspect.mockResolvedValue({
    ...opened,
    count: 3,
    kind: "page",
    format: "TIFF",
  })
  render.mockRejectedValueOnce(new Error("invalid"))
  const progress = vi.fn()
  const controller = new AbortController()
  const result = await convertFile(
    new File(["tiff"], "Report.tiff"),
    "webp",
    82,
    new Set(["report-page-2.webp"]),
    controller.signal,
    progress
  )
  expect(result.failure).toBe("invalid")
  expect(result.outputs.map(({ name }) => name)).toEqual([
    "Report-page-2-2.webp",
    "Report-page-3.webp",
  ])
  expect(result.outputs[0]).toMatchObject({ width: 200, height: 100 })
  expect(result.outputs[0]?.blob.type).toBe("image/webp")
  expect(render).toHaveBeenLastCalledWith(2, { format: "webp", quality: 82 })
  expect(progress.mock.calls).toEqual([
    [1, 3],
    [2, 3],
    [3, 3],
  ])
  expect(vi.mocked(imageSession).mock.lastCall?.[1].aborted).toBe(true)
  expect(controller.signal.aborted).toBe(false)
})

test("uses a white background for JPG and the decoder's default PNG output", async () => {
  const signal = new AbortController().signal
  const names = new Set<string>()
  await convertFile(image, "jpg", 90, names, signal, vi.fn())
  expect(render).toHaveBeenLastCalledWith(0, {
    quality: 90,
    background: "#ffffff",
  })
  expect(
    await convertFile(image, "png", 90, names, signal, vi.fn())
  ).toMatchObject({
    outputs: [{ name: "picture.png" }],
  })
  expect(render).toHaveBeenLastCalledWith(0, undefined)
})

test("reports an unreadable file and stops processing a crashed worker", async () => {
  const signal = new AbortController().signal
  const names = new Set<string>()
  inspect.mockRejectedValueOnce(new Error("unsupported"))
  expect(await convertFile(image, "png", 90, names, signal, vi.fn())).toEqual({
    outputs: [],
    failure: "unsupported",
  })
  inspect.mockResolvedValue({ ...opened, count: 2 })
  render.mockRejectedValueOnce(new Error("engineError"))
  expect(await convertFile(image, "png", 90, names, signal, vi.fn())).toEqual({
    outputs: [],
    failure: "engineError",
  })
  expect(render).toHaveBeenCalledOnce()
})

test("propagates cancellation before and during rendering", async () => {
  const controller = new AbortController()
  const signal = controller.signal
  render.mockImplementationOnce(() => {
    controller.abort()
    throw new Error("worker closed")
  })
  await expect(
    convertFile(image, "jpg", 90, new Set(), signal, vi.fn())
  ).rejects.toThrow(/abort/i)
  inspect.mockImplementationOnce(() => signal.throwIfAborted())
  await expect(
    convertFile(image, "png", 90, new Set(), signal, vi.fn())
  ).rejects.toThrow(/abort/i)
})
