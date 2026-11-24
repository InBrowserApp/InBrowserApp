import { afterEach, expect, test, vi } from "vitest"

import type { ProtectRequest } from "./encrypt.worker"

const encrypt = vi.hoisted(() => vi.fn())
vi.mock("./core/encrypt", () => ({ encryptPdf: encrypt }))
afterEach(() => vi.unstubAllGlobals())

test("returns encrypted bytes on success and reports failure to the client", async () => {
  const worker = {
    postMessage: vi.fn(),
    onmessage: undefined as
      | ((event: { data: ProtectRequest }) => Promise<void>)
      | undefined,
  }
  vi.stubGlobal("self", worker)
  await import("./encrypt.worker")

  const request = {
    file: new File(["PDF"], "sample.pdf"),
    password: "passphrase",
  }
  const result = new Blob(["protected PDF"])
  encrypt.mockResolvedValueOnce(result).mockRejectedValueOnce(new Error("qpdf"))
  await worker.onmessage?.({ data: request })
  await worker.onmessage?.({ data: request })

  expect(encrypt).toHaveBeenCalledWith(request.file, request.password)
  expect(worker.postMessage).toHaveBeenNthCalledWith(1, result)
  expect(worker.postMessage).toHaveBeenNthCalledWith(2, null)
})
