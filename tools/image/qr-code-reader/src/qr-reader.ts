import jsQR from 'jsqr'

/**
 * Read QR code from a File (image)
 */
export async function readQRFromFile(file: File): Promise<string | null> {
  const img = new Image()
  const url = URL.createObjectURL(file)

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    return code?.data ?? null
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Read QR code from a video frame (for camera scanning)
 */
export function readQRFromVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement): string | null {
  if (video.videoWidth === 0 || video.videoHeight === 0) return null

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  ctx.drawImage(video, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height)

  return code?.data ?? null
}
