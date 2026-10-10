import { imageSession } from "@workspace/raster-image"
import { failureOf } from "@workspace/raster-image/failure"
import type { Failure, ImageInfo } from "@workspace/raster-image/types"
import { getJpegQuality } from "../core/options"
import type { PdfImageInput } from "../core/pdf-document"
import type { QualityPreset } from "../core/options"
import type { ImageQueueItem } from "./types"

const SUPPORTED_IMAGE_ACCEPT =
  ".jpg,.jpeg,.png,.apng,.gif,.bmp,.webp,.avif,.tif,.tiff,.ico,.heic,.heif,.jxl,.jp2,.j2k,.jpf,.jpx,.jpm,.mj2"
let nextId = 0

function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function openSource(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  const lifetime = new AbortController()
  const abort = () => lifetime.abort()
  signal.addEventListener("abort", abort, { once: true })
  const close = () => {
    signal.removeEventListener("abort", abort)
    lifetime.abort()
  }
  try {
    return { session: imageSession(file, lifetime.signal), close }
  } catch (reason) {
    close()
    throw reason
  }
}

function releasePages(items: readonly ImageQueueItem[]) {
  for (const item of items) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
  }
}

function makePage(
  file: File,
  sourceIndex: number,
  info: ImageInfo | null
): ImageQueueItem {
  return {
    id: `image-page-${++nextId}`,
    file,
    name: file.name,
    size: file.size,
    sourceIndex,
    info,
    selected: true,
    width: 0,
    height: 0,
    previewUrl: null,
    rotation: 0,
  }
}

async function readSourcePages(
  file: File,
  signal: AbortSignal,
  onProgress: (completed: number, total: number) => void
): Promise<ImageQueueItem[]> {
  const items: ImageQueueItem[] = []
  let source: ReturnType<typeof openSource> | undefined
  try {
    source = openSource(file, signal)
    const info = await source.session.inspect()
    signal.throwIfAborted()
    for (let index = 0; index < info.count; index++) {
      let item = makePage(file, index, info)
      try {
        const preview = await source.session.render(index, undefined, {
          maxDimension: 192,
        })
        signal.throwIfAborted()
        item = {
          ...item,
          width: preview.fullWidth,
          height: preview.fullHeight,
          previewUrl: URL.createObjectURL(
            new Blob([preview.bytes], { type: preview.mime })
          ),
        }
      } catch (reason) {
        if (signal.aborted) throw reason
        item = { ...item, failure: failureOf(reason) }
      }
      items.push(item)
      onProgress(index + 1, info.count)
    }
    return items
  } catch (reason) {
    releasePages(items)
    if (signal.aborted) throw reason
    return [{ ...makePage(file, 0, null), failure: failureOf(reason) }]
  } finally {
    source?.close()
  }
}

class ImagePageError extends Error {
  constructor(
    readonly item: ImageQueueItem,
    readonly failure: Failure
  ) {
    super("imagePage")
  }
}

function createPageRenderer(signal: AbortSignal) {
  let current: { file: File; source: ReturnType<typeof openSource> } | undefined
  return {
    async render(
      item: ImageQueueItem,
      quality: QualityPreset
    ): Promise<PdfImageInput> {
      try {
        signal.throwIfAborted()
        if (current?.file !== item.file) {
          current?.source.close()
          current = { file: item.file, source: openSource(item.file, signal) }
          await current.source.session.inspect()
        }
        const preview = await current.source.session.render(
          item.sourceIndex,
          {
            quality: Math.round(getJpegQuality(quality) * 100),
            background: "#ffffff",
          },
          { rotation: item.rotation }
        )
        signal.throwIfAborted()
        return {
          jpegBytes: preview.bytes,
          width: preview.width,
          height: preview.height,
        }
      } catch (reason) {
        if (signal.aborted) throw reason
        throw new ImagePageError(item, failureOf(reason))
      }
    },
    close() {
      current?.source.close()
    },
  }
}

export {
  SUPPORTED_IMAGE_ACCEPT,
  getFileSignature,
  readSourcePages,
  releasePages,
  createPageRenderer,
  ImagePageError,
}
