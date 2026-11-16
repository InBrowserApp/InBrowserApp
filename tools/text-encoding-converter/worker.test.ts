import { afterEach, expect, it, vi } from "vitest"
import type { ConversionRequest } from "./types"

const originalHandler = self.onmessage
const options = {
  source: "auto",
  target: "utf-8",
  bom: "remove",
  lineEnding: "preserve",
} as const
afterEach(() => {
  self.onmessage = originalHandler
  vi.restoreAllMocks()
})

async function run(input: File | string) {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  vi.resetModules()
  await import("./worker")
  await (
    self.onmessage as unknown as (event: {
      data: ConversionRequest
    }) => Promise<void>
  )({ data: { input, ...options } })
  return post
}

it("transfers actual encoded output for text", async () => {
  const post = await run("hello")
  expect(post).toHaveBeenCalledWith(
    {
      result: expect.objectContaining({ sourcePreview: "hello", error: null }),
    },
    { transfer: [expect.any(ArrayBuffer)] }
  )
})
it("reads files as bytes", async () => {
  const post = await run(
    new File([new Uint8Array([0xef, 0xbb, 0xbf, 65])], "test.txt")
  )
  expect(post).toHaveBeenCalledWith(
    {
      result: expect.objectContaining({
        sourcePreview: "A",
        sourceBom: "utf-8",
      }),
    },
    { transfer: [expect.any(ArrayBuffer)] }
  )
})
it("does not transfer an invalid or ambiguous output", async () => {
  const post = await run(new File([new Uint8Array([0x81])], "test.txt"))
  expect(post).toHaveBeenCalledWith(
    {
      result: expect.objectContaining({ bytes: null, error: "sourceUnknown" }),
    },
    { transfer: [] }
  )
})
it("returns a recoverable failure when reading exhausts resources or fails", async () => {
  const file = new File([], "broken.txt")
  vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("Read failed"))
  expect(await run(file)).toHaveBeenCalledWith({ failed: true })
})
