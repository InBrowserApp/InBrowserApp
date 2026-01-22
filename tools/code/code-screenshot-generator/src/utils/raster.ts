export type RasterFormat = 'png' | 'jpeg'

export type RasterOptions = {
  svg: string
  width: number
  height: number
  scale: number
  format: RasterFormat
  quality?: number
  backgroundColor?: string
}

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = url
  })

export const rasterizeSvg = async ({
  svg,
  width,
  height,
  scale,
  format,
  quality,
  backgroundColor,
}: RasterOptions): Promise<Blob> => {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  try {
    const image = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas context unavailable')
    }

    if (format === 'jpeg' && backgroundColor) {
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error('Failed to generate image'))
            return
          }
          resolve(result)
        },
        format === 'png' ? 'image/png' : 'image/jpeg',
        quality,
      )
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
