export type LoadedImageSource = Readonly<{
  cleanup?: () => void
  height: number
  image: CanvasImageSource
  width: number
}>

export async function loadImageSource(file: File): Promise<LoadedImageSource> {
  if ("createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      if (!bitmap.width || !bitmap.height) {
        bitmap.close()
        throw new Error("INVALID_IMAGE")
      }

      return {
        cleanup: () => {
          bitmap.close()
        },
        height: bitmap.height,
        image: bitmap,
        width: bitmap.width,
      }
    } catch {
      // Fall back to HTMLImageElement for formats not handled by ImageBitmap.
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()

      element.onload = () => {
        if (!element.naturalWidth || !element.naturalHeight) {
          reject(new Error("INVALID_IMAGE"))
          return
        }

        resolve(element)
      }
      element.onerror = () => {
        reject(new Error("INVALID_IMAGE"))
      }
      element.src = objectUrl
    })

    return {
      cleanup: () => {
        URL.revokeObjectURL(objectUrl)
      },
      height: image.naturalHeight || image.height,
      image,
      width: image.naturalWidth || image.width,
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

export function canvasBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/webp" | "image/png",
  quality?: number
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}
