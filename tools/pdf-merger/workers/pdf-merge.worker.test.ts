import { PDFDocument } from "pdf-lib"
import { describe, expect, test, vi } from "vitest"

import { mergePdfWorkerRequest, toWorkerErrorMessage } from "./pdf-merge.worker"
import { copyBytesToArrayBuffer } from "../core/pdf-merger"

async function createPdf(pageCount: number) {
  const document = await PDFDocument.create()

  for (let index = 0; index < pageCount; index += 1) {
    document.addPage([200, 300])
  }

  return copyBytesToArrayBuffer(await document.save())
}

describe("pdf merge worker", () => {
  test("posts progress and result messages", async () => {
    const postMessage = vi.fn()

    await mergePdfWorkerRequest(
      {
        id: 7,
        sources: [
          { buffer: await createPdf(1), name: "a.pdf" },
          { buffer: await createPdf(2), name: "b.pdf" },
        ],
      },
      postMessage
    )

    expect(postMessage).toHaveBeenNthCalledWith(1, {
      id: 7,
      ok: true,
      progress: { completed: 1, total: 2 },
      type: "progress",
    })
    expect(postMessage).toHaveBeenNthCalledWith(2, {
      id: 7,
      ok: true,
      progress: { completed: 2, total: 2 },
      type: "progress",
    })
    expect(postMessage.mock.calls[2]?.[0]).toMatchObject({
      id: 7,
      ok: true,
      type: "result",
    })
    expect(postMessage.mock.calls[2]?.[1]).toHaveLength(1)
  })

  test("posts error messages for failed merges", async () => {
    const postMessage = vi.fn()

    await mergePdfWorkerRequest(
      {
        id: 8,
        sources: [
          { buffer: await createPdf(1), name: "a.pdf" },
          { buffer: new ArrayBuffer(2), name: "bad.pdf" },
        ],
      },
      postMessage
    )

    expect(postMessage.mock.calls.at(-1)?.[0]).toMatchObject({
      id: 8,
      message: "merge-failed",
      ok: false,
      type: "error",
    })
    expect(toWorkerErrorMessage("plain")).toBe("plain")
  })
})
