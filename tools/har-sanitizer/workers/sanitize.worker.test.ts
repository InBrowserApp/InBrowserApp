import { afterEach, expect, it, vi } from "vitest"
import type { SanitizeRequest } from "./sanitize.worker"

const original = self.onmessage
afterEach(() => {
  self.onmessage = original
  vi.restoreAllMocks()
})

it("posts a result, invalid status, or read failure", async () => {
  const postMessage = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./sanitize.worker")
  const options = { parameters: true, bodies: true }
  const run = (file: File) =>
    self.onmessage!(
      new MessageEvent<SanitizeRequest>("message", { data: { file, options } })
    )

  await run(new File(['{"log":{"entries":[]}}'], "good.har"))
  expect(postMessage).toHaveBeenLastCalledWith({
    status: "ready",
    result: {
      output: expect.any(Blob),
      summary: {
        requests: 0,
        removedCredentials: 0,
        maskedParameters: 0,
        removedBodies: 0,
      },
    },
  })

  await run(new File(["bad"], "bad.har"))
  expect(postMessage).toHaveBeenLastCalledWith({ status: "invalid" })

  const unreadable = new File([], "unreadable.har")
  vi.spyOn(unreadable, "text").mockRejectedValueOnce(new Error("Read failed"))
  await run(unreadable)
  expect(postMessage).toHaveBeenLastCalledWith({ status: "failed" })
})
