// @vitest-environment jsdom
import { Blob as NodeBlob } from "node:buffer"
import { URL as NodeURL } from "node:url"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { bookImages } from "./resources"
const mock = vi.hoisted(() => ({ readableImage: vi.fn() }))
vi.mock("@workspace/web-document", async (original) => ({
  ...(await original<object>()),
  readableImage: mock.readableImage,
}))
const urls: string[] = []
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB"
function blob(data: BlobPart) {
  const url = URL.createObjectURL(new Blob([data]))
  urls.push(url)
  return url
}
beforeEach(() => {
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("URL", NodeURL)
  mock.readableImage.mockReset().mockResolvedValue(true)
})
afterEach(() => {
  for (const url of urls.splice(0)) URL.revokeObjectURL(url)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
test("embeds local raster and static SVG images without allowing remote or active resources", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
  const images = bookImages(new AbortController().signal)
  for (const source of [
    "https://tracker.invalid/pixel",
    "//tracker.invalid/pixel",
    "file:///private",
    "javascript:alert(1)",
    "data:text/html,<script>bad()</script>",
    "missing.png",
  ])
    expect(await images.embed(source)).toBeNull()
  expect(fetchSpy).not.toHaveBeenCalled()
  const local = blob(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const embedded = await images.embed(local)
  expect(embedded).toMatch(/^data:image\/png;base64,/)
  expect(await images.embed(local)).toBe(embedded)
  expect(fetchSpy).toHaveBeenCalledTimes(1)
  const svg = blob(
    `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>bad()</script><rect width="10" height="10" fill="red"/><image href="${png}"/><image href="https://tracker.invalid/pixel"/><foreignObject><div>active</div></foreignObject></svg>`
  )
  const clean = decodeURIComponent((await images.embed(svg))!)
  expect(clean).toContain("<rect")
  expect(clean).toContain(png)
  expect(clean).not.toContain("tracker.invalid")
  expect(clean).not.toMatch(/script|foreignObject/)
  expect(images.missing).toBe(true)
  expect(
    fetchSpy.mock.calls.every(([url]) => String(url).startsWith("blob:"))
  ).toBe(true)
})
test("marks corrupt bytes and decoder failures unavailable, without swallowing cancellation or memory failures", async () => {
  const controller = new AbortController()
  const images = bookImages(controller.signal)
  expect(await images.embed(blob("not an image"))).toBeNull()
  expect(
    await images.embed(blob('<svg xmlns="http://www.w3.org/2000/svg"><broken>'))
  ).toBeNull()
  mock.readableImage.mockResolvedValueOnce(false)
  expect(await images.embed(png)).toBeNull()
  expect(images.missing).toBe(true)
  mock.readableImage.mockRejectedValueOnce(new RangeError("allocation"))
  await expect(images.embed(png + "a")).rejects.toThrow(RangeError)
  mock.readableImage.mockImplementationOnce(() => {
    controller.abort()
    throw controller.signal.reason
  })
  await expect(images.embed(png + "b")).rejects.toMatchObject({
    name: "AbortError",
  })
  await expect(images.embed(png + "c")).rejects.toMatchObject({
    name: "AbortError",
  })
})
