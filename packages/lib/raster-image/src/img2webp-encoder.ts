import {
  Img2Webp,
  initLocateFile,
  runImg2Webp,
} from "@libwebp-wasm/img2webp/es/img2webp"
import Img2WebpWasmUrl from "@libwebp-wasm/img2webp/es/img2webp.wasm?url"

type Img2WebpModule = Awaited<ReturnType<typeof Img2Webp>>

type PngAnimationFrame = Readonly<{
  data: Uint8Array
  duration: number
}>

function createLosslessImg2WebpArgs(
  framePaths: readonly string[],
  durations: readonly number[],
  loopCount: number,
  outputPath: string
) {
  const args = [
    "-min_size",
    "-loop",
    String(Math.max(0, Math.round(loopCount))),
    "-lossless",
    "-q",
    "100",
    "-m",
    "6",
  ]

  for (const [index, framePath] of framePaths.entries()) {
    args.push("-d", String(Math.max(1, Math.round(durations[index] ?? 100))))
    args.push(framePath)
  }

  args.push("-o", outputPath)

  return args
}

/* v8 ignore start -- WASM filesystem integration is browser/bundler only. */
let img2WebpPromise: Promise<Img2WebpModule> | null = null
let conversionCounter = 0

function getImg2WebpModule() {
  if (!img2WebpPromise) {
    const originalConsoleError = console.error

    console.error = (...args) => {
      const [message] = args

      if (typeof message === "string" && message.startsWith("output file: ")) {
        return
      }

      originalConsoleError(...args)
    }

    img2WebpPromise = Img2Webp(initLocateFile(Img2WebpWasmUrl)).finally(() => {
      console.error = originalConsoleError
    })
  }

  return img2WebpPromise
}

function unlinkIfExists(module: Img2WebpModule, path: string) {
  if (module.FS.analyzePath(path).exists) {
    module.FS.unlink(path)
  }
}

async function encodePngFramesWithImg2Webp(
  frames: readonly PngAnimationFrame[],
  loopCount: number
) {
  if (frames.length === 0) {
    throw new Error("EMPTY_GIF")
  }

  const module = await getImg2WebpModule()
  const conversionId = conversionCounter

  conversionCounter += 1

  const framePaths = frames.map(
    (_, index) => `/gif-to-webp-${conversionId}-${index}.png`
  )
  const outputPath = `/gif-to-webp-${conversionId}.webp`

  unlinkIfExists(module, outputPath)

  for (const [index, frame] of frames.entries()) {
    unlinkIfExists(module, framePaths[index]!)
    module.FS.writeFile(framePaths[index]!, frame.data)
  }

  try {
    runImg2Webp(
      module,
      "_main",
      ...createLosslessImg2WebpArgs(
        framePaths,
        frames.map((frame) => frame.duration),
        loopCount,
        outputPath
      )
    )

    if (!module.FS.analyzePath(outputPath).exists) {
      throw new Error("CONVERSION_FAILED")
    }

    return module.FS.readFile(outputPath).slice()
  } finally {
    for (const framePath of framePaths) {
      unlinkIfExists(module, framePath)
    }
    unlinkIfExists(module, outputPath)
  }
}
/* v8 ignore stop */

export { createLosslessImg2WebpArgs, encodePngFramesWithImg2Webp }
export type { PngAnimationFrame }
