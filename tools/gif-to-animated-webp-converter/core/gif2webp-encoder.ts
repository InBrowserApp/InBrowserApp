import {
  Gif2Webp,
  initLocateFile,
  runGif2Webp,
} from "@libwebp-wasm/gif2webp/es/gif2webp"
import Gif2WebpWasmUrl from "@libwebp-wasm/gif2webp/es/gif2webp.wasm?url"

type Gif2WebpModule = Awaited<ReturnType<typeof Gif2Webp>>

function createLosslessGif2WebpArgs(inputPath: string, outputPath: string) {
  return [
    "-quiet",
    "-min_size",
    "-q",
    "100",
    "-m",
    "6",
    "-metadata",
    "none",
    inputPath,
    "-o",
    outputPath,
  ]
}

/* v8 ignore start -- WASM filesystem integration is browser/bundler only. */
let gif2WebpPromise: Promise<Gif2WebpModule> | null = null
let conversionCounter = 0

function getGif2WebpModule() {
  if (!gif2WebpPromise) {
    gif2WebpPromise = Gif2Webp(initLocateFile(Gif2WebpWasmUrl))
  }

  return gif2WebpPromise
}

function unlinkIfExists(module: Gif2WebpModule, path: string) {
  if (module.FS.analyzePath(path).exists) {
    module.FS.unlink(path)
  }
}

async function encodeGifBytesWithGif2Webp(gifBytes: Uint8Array) {
  const module = await getGif2WebpModule()
  const conversionId = conversionCounter

  conversionCounter += 1

  const inputPath = `/gif-to-webp-${conversionId}.gif`
  const outputPath = `/gif-to-webp-${conversionId}.webp`

  unlinkIfExists(module, inputPath)
  unlinkIfExists(module, outputPath)
  module.FS.writeFile(inputPath, gifBytes)

  try {
    runGif2Webp(
      module,
      "_main",
      ...createLosslessGif2WebpArgs(inputPath, outputPath)
    )

    if (!module.FS.analyzePath(outputPath).exists) {
      throw new Error("CONVERSION_FAILED")
    }

    return module.FS.readFile(outputPath).slice()
  } finally {
    unlinkIfExists(module, inputPath)
    unlinkIfExists(module, outputPath)
  }
}
/* v8 ignore stop */

export { createLosslessGif2WebpArgs, encodeGifBytesWithGif2Webp }
