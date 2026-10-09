import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { decodeImage } from "./image"

let image: {
  onload: null | (() => void)
  onerror: null | (() => void)
  removeAttribute: ReturnType<typeof vi.fn>
  naturalWidth: number
  naturalHeight: number
  src: string
}
beforeEach(() => {
  vi.stubGlobal(
    "Image",
    class {
      constructor() {
        image = {
          onload: null,
          onerror: null,
          removeAttribute: vi.fn(),
          naturalWidth: 600,
          naturalHeight: 900,
          src: "",
        }
        return image
      }
    }
  )
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:page")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
test("decodes a local blob and releases the temporary image element", async () => {
  const pending = decodeImage(new Blob(), new AbortController().signal)
  expect(image.src).toBe("blob:page")
  image.onload!()
  expect(await pending).toEqual({ url: "blob:page", width: 600, height: 900 })
  expect(image.removeAttribute).toHaveBeenCalledWith("src")
  expect(URL.revokeObjectURL).not.toHaveBeenCalled()
})
test.each(["error", "empty", "abort"])("revokes URLs on %s", async (reason) => {
  const controller = new AbortController()
  const pending = decodeImage(new Blob(), controller.signal)
  if (reason === "error") image.onerror!()
  if (reason === "empty") {
    image.naturalWidth = 0
    image.onload!()
  }
  if (reason === "abort") controller.abort()
  await expect(pending).rejects.toThrow(/decoding|Empty|abort/i)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:page")
})
test("does not create an image after cancellation", () => {
  const controller = new AbortController()
  controller.abort()
  expect(() => decodeImage(new Blob(), controller.signal)).toThrow(/abort/i)
  expect(URL.createObjectURL).not.toHaveBeenCalled()
})
