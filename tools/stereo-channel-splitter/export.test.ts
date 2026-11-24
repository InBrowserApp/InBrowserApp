import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { encodeDownloads } from "./export"
import type { ExportRequest, ExportResponse } from "./workers/export"

const files = { left: new Blob(["left"]), right: new Blob(["right"]) }
const request: ExportRequest = { files, format: "flac" }
const worker = {
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: null as ((event: MessageEvent<ExportResponse>) => void) | null,
  onerror: null as (() => void) | null,
  onmessageerror: null as (() => void) | null,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal("Worker", function () {
    return worker
  })
})
afterEach(() => vi.unstubAllGlobals())

describe("encodeDownloads", () => {
  it("returns the two files and closes the worker", async () => {
    const promise = encodeDownloads(request, new AbortController().signal)
    expect(worker.postMessage).toHaveBeenCalledWith(request)
    worker.onmessage!(new MessageEvent("message", { data: files }))
    await expect(promise).resolves.toEqual(files)
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it.each(["message", "error", "messageerror"])(
    "closes the worker after a %s failure",
    async (failure) => {
      const promise = encodeDownloads(request, new AbortController().signal)
      if (failure === "message") {
        worker.onmessage!(
          new MessageEvent("message", { data: { error: true } })
        )
      } else worker[`on${failure}` as "onerror" | "onmessageerror"]!()
      await expect(promise).rejects.toThrow("Audio export failed")
      expect(worker.terminate).toHaveBeenCalledOnce()
    }
  )

  it("stops the worker when a request is superseded", async () => {
    const controller = new AbortController()
    const promise = encodeDownloads(request, controller.signal)
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: "AbortError" })
    expect(worker.terminate).toHaveBeenCalledOnce()
    await expect(
      encodeDownloads(request, controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
    expect(worker.postMessage).toHaveBeenCalledOnce()
  })
})
