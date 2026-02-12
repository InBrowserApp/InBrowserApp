export type ImageFormat = 'png' | 'jpeg' | 'webp'

export type RenderPageOptions = {
  dpi: number
  format: ImageFormat
  quality: number
}

export type PdfPageImage = {
  page: number
  width: number
  height: number
  blob: Blob
  dpi: number
  format: ImageFormat
  quality: number
}

export type ZipImageEntry = {
  name: string
  blob: Blob
}
