import { compressImage, outputName } from "./compress"
import type { DimensionConstraint, Format, ReadyImage } from "./compress"
import type { Messages } from "./messages"

export type ImageOutcome =
  | { file: File; image: ReadyImage; error?: never }
  | { file: File; image?: never; error: string }

export type CompressionRequest = {
  format: Format
  limit: number
  dimensions: DimensionConstraint
}

export function fileKey(file: File) {
  return JSON.stringify([file.name, file.size, file.lastModified, file.type])
}

export function requestKey({ format, limit, dimensions }: CompressionRequest) {
  return JSON.stringify([format, limit, dimensions])
}

export async function compressBatch(
  files: readonly File[],
  { format, limit, dimensions }: CompressionRequest,
  previous: readonly ImageOutcome[],
  messages: Messages,
  onProgress: (count: number) => void
) {
  const reusable = new Map<File, ReadyImage>()
  for (const { file, image } of previous) {
    if (image && image.blob.size <= limit) reusable.set(file, image)
  }

  const names = new Set(
    [...reusable.values()].map(({ name }) => name.toLowerCase())
  )
  const outcomes: ImageOutcome[] = []
  for (const [index, file] of files.entries()) {
    onProgress(index + 1)
    const existing = reusable.get(file)
    if (existing) {
      outcomes.push({ file, image: existing })
      continue
    }

    const name = outputName(file, format, names)
    try {
      outcomes.push({
        file,
        image: {
          ...(await compressImage(file, format, limit, dimensions)),
          name,
        },
      })
    } catch (error) {
      outcomes.push({
        file,
        error:
          error instanceof Error && error.message === "UNSUPPORTED_FORMAT"
            ? messages.unsupportedFormat
            : messages.readError,
      })
    }
  }
  return outcomes
}
