import { createWorker, OEM, PSM } from "tesseract.js"
import type { Worker } from "tesseract.js"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { recognizeImage } from "./recognize"

vi.mock("tesseract.js", () => ({
  createWorker: vi.fn(),
  OEM: { LSTM_ONLY: 1 },
  PSM: { AUTO: "3" },
}))

const startWorker = vi.mocked(createWorker)
const worker = {
  setParameters: vi.fn().mockResolvedValue(undefined),
  recognize: vi.fn(),
  terminate: vi.fn().mockResolvedValue(undefined),
}
const image = new File(["image"], "screenshot.png", { type: "image/png" })

beforeEach(() => {
  vi.clearAllMocks()
  startWorker.mockResolvedValue(worker as unknown as Worker)
  worker.recognize.mockResolvedValue({
    data: { text: "  訂 單 OCR 2026\n品 項  數 量\n" },
  })
})

describe("OCR worker", () => {
  it("initializes the standard bilingual models from same-origin assets", async () => {
    const progress = vi.fn()
    await expect(
      recognizeImage(image, "chi_tra", new AbortController().signal, progress)
    ).resolves.toBe("訂單 OCR 2026\n品項  數量")
    expect(startWorker).toHaveBeenCalledWith(
      "chi_tra+eng",
      OEM.LSTM_ONLY,
      expect.objectContaining({
        langPath: "/ocr-data/4.0.0_best_int",
        workerBlobURL: false,
      })
    )
    const logger = startWorker.mock.lastCall?.[2]?.logger
    const context = {
      jobId: "job",
      userJobId: "job",
      workerId: "worker",
      progress: 0.75,
    }
    logger?.({ ...context, status: "initializing api" })
    expect(progress).not.toHaveBeenCalled()
    logger?.({ ...context, status: "recognizing text" })
    expect(progress).toHaveBeenCalledWith(0.75)
    expect(worker.setParameters).toHaveBeenCalledWith({
      tessedit_pageseg_mode: PSM.AUTO,
    })
    expect(worker.recognize).toHaveBeenCalledWith(image)
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it("surfaces model initialization errors even if the engine promise stays pending", async () => {
    startWorker.mockImplementationOnce((_langs, _oem, options) => {
      options?.errorHandler?.(new Error("Model unavailable"))
      return new Promise(() => {})
    })
    await expect(
      recognizeImage(image, "eng", new AbortController().signal, vi.fn())
    ).rejects.toThrow("Model unavailable")
  })

  it("releases the worker when the input is replaced during recognition", async () => {
    const run = new AbortController()
    worker.recognize.mockReturnValueOnce(new Promise(() => {}))
    const result = recognizeImage(image, "eng", run.signal, vi.fn())
    await vi.waitFor(() => expect(worker.recognize).toHaveBeenCalledOnce())
    run.abort()
    await expect(result).rejects.toMatchObject({ name: "AbortError" })
    expect(worker.terminate).toHaveBeenCalledOnce()
  })
})
