import { imageSession } from "@workspace/raster-image"
import { failureOf } from "@workspace/raster-image/failure"
import { imageFilename } from "@workspace/raster-image/filename"
import type { Failure, ImageOutputOptions } from "@workspace/raster-image/types"

export const formats = ["jpg", "png", "webp"] as const
export type Format = (typeof formats)[number]
export const formatLabels: Record<Format, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
}

export type Output = {
  name: string
  blob: Blob
  width: number
  height: number
}

export type FileResult = {
  outputs: Output[]
  failure?: Failure
}

function uniqueName(name: string, names: Set<string>) {
  const dot = name.lastIndexOf(".")
  const stem = name.slice(0, dot)
  const extension = name.slice(dot)
  let candidate = name
  for (
    let suffix = 2;
    names.has(candidate.normalize("NFC").toLowerCase());
    suffix++
  ) {
    candidate = `${stem}-${suffix}${extension}`
  }
  names.add(candidate.normalize("NFC").toLowerCase())
  return candidate
}

export async function convertFile(
  file: File,
  format: Format,
  quality: number,
  names: Set<string>,
  signal: AbortSignal,
  onProgress: (current: number, total: number) => void
): Promise<FileResult> {
  const lifetime = new AbortController()
  const sessionSignal = AbortSignal.any([signal, lifetime.signal])
  const result: FileResult = { outputs: [] }
  const options: ImageOutputOptions | undefined =
    format === "jpg"
      ? { quality, background: "#ffffff" }
      : format === "webp"
        ? { format: "webp", quality }
        : undefined

  try {
    const session = imageSession(file, sessionSignal)
    const info = await session.inspect()
    signal.throwIfAborted()
    for (let index = 0; index < info.count; index++) {
      onProgress(index + 1, info.count)
      try {
        const { bytes, mime, width, height } = await session.render(
          index,
          options
        )
        signal.throwIfAborted()
        result.outputs.push({
          name: uniqueName(
            imageFilename(file.name, info, index, format),
            names
          ),
          blob: new Blob([bytes], { type: mime }),
          width,
          height,
        })
      } catch (reason) {
        signal.throwIfAborted()
        const failure = failureOf(reason)
        result.failure ??= failure
        if (failure === "engineError") break
      }
    }
  } catch (reason) {
    signal.throwIfAborted()
    result.failure = failureOf(reason)
  } finally {
    lifetime.abort()
  }
  return result
}
