import { createWorker, OEM, PSM } from "tesseract.js"
import type { LoggerMessage, Worker } from "tesseract.js"

import workerPath from "tesseract.js/dist/worker.min.js?url"
import corePath from "tesseract.js-core/tesseract-core-lstm.wasm.js?url"

const langPath = "/ocr-data/4.0.0_best_int"
export type Language = "eng" | "chi_sim" | "chi_tra"

export async function recognizeImage(
  image: File,
  language: Language,
  signal: AbortSignal,
  onProgress: (progress: number) => void
) {
  signal.throwIfAborted()
  const langs = language === "eng" ? language : `${language}+eng`

  const worker = await new Promise<Worker>((resolve, reject) => {
    void createWorker(langs, OEM.LSTM_ONLY, {
      workerPath,
      corePath,
      langPath,
      workerBlobURL: false,
      cacheMethod: "none",
      // Initialization failures can arrive via errorHandler in Tesseract.js.
      errorHandler: reject,
      logger: ({ status, progress }: LoggerMessage) => {
        if (status === "recognizing text") onProgress(progress)
      },
    }).then(resolve, reject)
  })

  let abort: (() => void) | undefined
  try {
    signal.throwIfAborted()
    const cancelled = new Promise<never>((_, reject) => {
      abort = () => reject(signal.reason)
      signal.addEventListener("abort", abort, { once: true })
    })
    const result = worker
      .setParameters({ tessedit_pageseg_mode: PSM.AUTO })
      .then(() => worker.recognize(image))
    const { data } = await Promise.race([result, cancelled])
    const text = data.text.trim()
    // Tesseract inserts a single space between adjacent Chinese word segments.
    return language === "eng"
      ? text
      : text.replace(/(\p{Script=Han}) (?=\p{Script=Han})/gu, "$1")
  } finally {
    if (abort) signal.removeEventListener("abort", abort)
    await worker.terminate()
  }
}
