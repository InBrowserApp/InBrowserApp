/* v8 ignore start -- browser-only image loading and canvas utilities */
type LoadedImageSource = Readonly<{
  image: CanvasImageSource
  width: number
  height: number
  cleanup?: () => void
}>

async function canvasToPngBlob(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png")
  })

  if (!blob) {
    throw new Error("FAILED_TO_CREATE_IMAGE")
  }

  return blob
}

async function loadImageSource(file: Blob): Promise<LoadedImageSource> {
  if ("createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      return {
        image: bitmap,
        width: Math.max(1, Math.round(bitmap.width)),
        height: Math.max(1, Math.round(bitmap.height)),
        cleanup: () => {
          bitmap.close()
        },
      }
    } catch {
      // Fall back to HTMLImageElement below.
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error("INVALID_IMAGE"))
      element.src = objectUrl
    })

    return {
      image,
      width: Math.max(1, image.naturalWidth || image.width),
      height: Math.max(1, image.naturalHeight || image.height),
      cleanup: () => {
        URL.revokeObjectURL(objectUrl)
      },
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function readImageDimensions(file: Blob) {
  const source = await loadImageSource(file)

  try {
    return {
      width: source.width,
      height: source.height,
    }
  } finally {
    source.cleanup?.()
  }
}

function fillRoundedBackground(
  context: CanvasRenderingContext2D,
  size: number,
  color: string,
  radiusPercentage: number
) {
  const radius = (size * radiusPercentage) / 200
  context.fillStyle = color

  if (radius > 0 && "roundRect" in context) {
    context.beginPath()
    context.roundRect(0, 0, size, size, radius)
    context.fill()
    return
  }

  context.fillRect(0, 0, size, size)
}

export {
  canvasToPngBlob,
  fillRoundedBackground,
  loadImageSource,
  readImageDimensions,
}
export type { LoadedImageSource }
/* v8 ignore stop */
