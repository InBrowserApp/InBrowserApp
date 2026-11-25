import { expect, it, vi } from "vitest"
import { strFromU8, unzipSync } from "fflate"
import { exportSlides, formats, type Render } from "./export-slides"

const render: Render = async (slide, format) =>
  new Blob([String(slide)], { type: formats[format] })

it("names a single slide and preserves the chosen image format", async () => {
  const progress = vi.fn()
  const result = await exportSlides(render, {
    first: 3,
    last: 3,
    name: "Sales.PPTX",
    format: "webp",
    scale: 2,
    progress,
    signal: new AbortController().signal,
  })
  expect(result.name).toBe("Sales-slide-3.webp")
  expect(result.blob.type).toBe("image/webp")
  expect(await result.blob.text()).toBe("3")
  expect(progress).toHaveBeenCalledWith(1, 1)
})

it("packages the selected slide numbers in presentation order", async () => {
  const progress = vi.fn()
  const result = await exportSlides(render, {
    first: 8,
    last: 10,
    name: "Sales.potx",
    format: "jpg",
    scale: 1,
    progress,
    signal: new AbortController().signal,
  })
  const entries = unzipSync(new Uint8Array(await result.blob.arrayBuffer()))
  expect(result.name).toBe("Sales-slides-8-10-jpg.zip")
  expect(Object.keys(entries)).toEqual([
    "Sales-slide-08.jpg",
    "Sales-slide-09.jpg",
    "Sales-slide-10.jpg",
  ])
  expect(Object.values(entries).map((entry) => strFromU8(entry))).toEqual([
    "8",
    "9",
    "10",
  ])
  expect(progress.mock.calls).toEqual([
    [1, 3],
    [2, 3],
    [3, 3],
  ])
})

it("discards partial ZIP output after cancellation", async () => {
  const controller = new AbortController()
  const convert = vi.fn<Render>(async (...args) => {
    controller.abort()
    return render(...args)
  })
  await expect(
    exportSlides(convert, {
      first: 1,
      last: 3,
      name: ".pptx",
      format: "png",
      scale: 1,
      progress: vi.fn(),
      signal: controller.signal,
    })
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(convert).toHaveBeenCalledTimes(1)
})
