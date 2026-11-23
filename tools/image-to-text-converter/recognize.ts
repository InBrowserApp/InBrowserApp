import { createWorker, OEM, PSM } from "tesseract.js"
import type { LoggerMessage, Worker } from "tesseract.js"
import modelUrls from "virtual:tesseract-model-urls"

import upstreamWorker from "tesseract.js/dist/worker.min.js?url"
import corePath from "tesseract.js-core/tesseract-core-lstm.wasm.js?url"

import { isChinese, type Language } from "./languages"

const langPath = "/_astro/ocr"

function createWorkerUrl(languages: readonly Language[]) {
  const routes = Object.fromEntries(
    languages.map((code) => [
      new URL(`${langPath}/${code}.traineddata.gz`, location.href).href,
      new URL(modelUrls[code], location.href).href,
    ])
  )
  // Tesseract constructs fixed language filenames. Translate only those requests
  // inside its worker to the URLs emitted by Vite.
  const script = `
    const modelUrls = ${JSON.stringify(routes)}
    const fetchAsset = self.fetch.bind(self)
    self.fetch = (url, options) => fetchAsset(modelUrls[url] ?? url, options)
    importScripts(${JSON.stringify(new URL(upstreamWorker, location.href).href)})
  `
  return URL.createObjectURL(new Blob([script], { type: "text/javascript" }))
}

export async function recognizeImage(
  image: File,
  language: Language,
  includeEnglish: boolean,
  signal: AbortSignal,
  onProgress: (progress: number) => void
) {
  signal.throwIfAborted()
  const languages: Language[] =
    includeEnglish && language !== "eng" ? [language, "eng"] : [language]
  const segmentation = language.endsWith("_vert")
    ? PSM.SINGLE_BLOCK_VERT_TEXT
    : PSM.AUTO

  const workerPath = createWorkerUrl(languages)
  let activeWorker: Worker | undefined
  let abort: (() => void) | undefined
  try {
    const worker = await new Promise<Worker>((resolve, reject) => {
      void createWorker(languages.join("+"), OEM.LSTM_ONLY, {
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
    activeWorker = worker
    signal.throwIfAborted()
    const cancelled = new Promise<never>((_, reject) => {
      abort = () => reject(signal.reason)
      signal.addEventListener("abort", abort, { once: true })
    })
    const result = worker
      .setParameters({ tessedit_pageseg_mode: segmentation })
      .then(() => worker.recognize(image))
    const { data } = await Promise.race([result, cancelled])
    const text = data.text.trim()
    // Tesseract inserts a single space between adjacent Chinese word segments.
    return isChinese(language)
      ? text.replace(/(\p{Script=Han}) (?=\p{Script=Han})/gu, "$1")
      : text
  } finally {
    URL.revokeObjectURL(workerPath)
    if (abort) signal.removeEventListener("abort", abort)
    await activeWorker?.terminate()
  }
}
