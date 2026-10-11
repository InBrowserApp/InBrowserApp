import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { readableImage } from "./images"

class TestImage {
  static last: TestImage
  naturalWidth = 2
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  removeAttribute = vi.fn()
  constructor() {
    TestImage.last = this
  }
  set src(value: string) {
    if (value.endsWith("throw")) throw new RangeError("allocation")
  }
}
beforeEach(() => vi.stubGlobal("Image", TestImage))
afterEach(() => vi.unstubAllGlobals())

test("only decodes embedded supported images and releases the source on success or failure", async () => {
  const signal = new AbortController().signal
  for (const src of [
    "",
    "https://example.com/image.png",
    "file:///image.png",
    "data:text/html,x",
    "data:image/svg+xml;base64,AA==",
  ])
    expect(await readableImage(src, signal)).toBe(false)
  for (const src of [
    "data:image/png;base64,AA==",
    "data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E",
  ]) {
    const pending = readableImage(src, signal)
    const image = TestImage.last
    image.onload!()
    expect(await pending).toBe(true)
    expect(image.removeAttribute).toHaveBeenCalledWith("src")
    expect(image.onload).toBeNull()
  }
  let pending = readableImage("data:image/jpeg;base64,AA==", signal)
  TestImage.last.naturalWidth = 0
  TestImage.last.onload!()
  expect(await pending).toBe(false)
  pending = readableImage("data:image/png;base64,bad", signal)
  TestImage.last.onerror!()
  expect(await pending).toBe(false)
  await expect(
    readableImage("data:image/png;base64,throw", signal)
  ).rejects.toThrow("allocation")
})

test("cancels image decoding and rejects already aborted work", async () => {
  const controller = new AbortController()
  const pending = readableImage("data:image/png;base64,AA==", controller.signal)
  const image = TestImage.last
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(image.onerror).toBeNull()
  expect(image.removeAttribute).toHaveBeenCalledWith("src")
  await expect(readableImage("", controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})
