import type { Rotation } from "../core/options"

const IMAGE_TO_PDF_TOOL_ID = "image-to-pdf-converter"

type ImageQueueItem = Readonly<{
  file: File
  height: number
  id: string
  name: string
  previewUrl: string | null
  sourceIndex: number
  info: import("@workspace/raster-image/types").ImageInfo | null
  selected: boolean
  failure?: import("@workspace/raster-image/types").Failure
  rotation: Rotation
  size: number
  width: number
}>

type PdfResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

type ImageToPdfMessages = typeof import("../messages/en.json") & {
  meta: { name: string; description: string }
}

export { IMAGE_TO_PDF_TOOL_ID }
export type { ImageQueueItem, ImageToPdfMessages, PdfResult }
