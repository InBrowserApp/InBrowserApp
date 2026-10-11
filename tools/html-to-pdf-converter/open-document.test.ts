import { expect, test, vi } from "vitest"
import { prepare } from "./core/prepare"
import { openDocument } from "./open-document"

vi.mock("./core/prepare", () => ({
  prepare: vi.fn(() => ({ html: "<p>Text</p>", css: "" })),
}))
test("reads original bytes with XHTML mode and honors cancellation", async () => {
  const signal = new AbortController().signal
  const file = {
    name: "FILE.XHTML",
    arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
  } as File
  expect(await openDocument(file, signal)).toEqual({
    html: "<p>Text</p>",
    css: "",
  })
  expect(prepare).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]), true)
  const controller = new AbortController()
  const pending = openDocument(file, controller.signal)
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  await expect(openDocument(file, controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})
