import { createWorker, OEM, PSM } from "tesseract.js"
import type { LoggerMessage, Worker } from "tesseract.js"
import * as npmModelUrls from "./urls"

import upstreamWorker from "tesseract.js/dist/worker.min.js?url"
import corePath from "tesseract.js-core/tesseract-core-lstm.wasm.js?url"

import type { Language } from "./languages"

const langPath = "/_astro/ocr"
const modelUrls: Readonly<Record<Language, string>> = npmModelUrls

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

    // createWorker only exposes its worker after successful initialization.
    const send = self.postMessage.bind(self)
    self.postMessage = (message) => {
      send(message)
      if (message.status === "reject") {
        self.postMessage = () => {}
        self.close()
      }
    }

    importScripts(${JSON.stringify(new URL(upstreamWorker, location.href).href)})
  `
  return URL.createObjectURL(new Blob([script], { type: "text/javascript" }))
}

export async function withOcrWorker<T>(
  language: Language,
  includeEnglish: boolean,
  signal: AbortSignal,
  onProgress: (progress: number) => void,
  run: (worker: Worker) => Promise<T>
) {
  signal.throwIfAborted()
  const languages: Language[] =
    includeEnglish && language !== "eng" ? [language, "eng"] : [language]
  const segmentation = language.endsWith("_vert")
    ? PSM.SINGLE_BLOCK_VERT_TEXT
    : PSM.AUTO

  const workerPath = createWorkerUrl(languages)
  let interrupt!: (reason: unknown) => void
  const interrupted = new Promise<never>((_, reject) => {
    interrupt = reject
  })
  const abort = () => interrupt(signal.reason)
  signal.addEventListener("abort", abort, { once: true })
  let worker: Worker | undefined
  let disposed = false

  try {
    const startup = createWorker(languages.join("+"), OEM.LSTM_ONLY, {
      workerPath,
      corePath,
      langPath,
      workerBlobURL: false,
      cacheMethod: "none",
      // Model initialization errors can leave Tesseract's startup promise pending.
      errorHandler: interrupt,
      logger: ({ status, progress }: LoggerMessage) => {
        if (status === "recognizing text") onProgress(progress)
      },
    }).then(async (ready) => {
      // Tesseract exposes the worker only after initialization has finished.
      if (disposed) await ready.terminate()
      else worker = ready
      return ready
    })
    const ready = await Promise.race([interrupted, startup])
    signal.throwIfAborted()
    return await Promise.race([
      interrupted,
      ready.setParameters({ tessedit_pageseg_mode: segmentation }).then(() => {
        signal.throwIfAborted()
        return run(ready)
      }),
    ])
  } finally {
    disposed = true
    URL.revokeObjectURL(workerPath)
    signal.removeEventListener("abort", abort)
    await worker?.terminate()
  }
}
