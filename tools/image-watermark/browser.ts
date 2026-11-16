import { ACCEPT, assertDimensions } from "./core/files"
import type { ImageSource } from "./types"

export async function loadImage(file: File): Promise<ImageSource> {
  if (!ACCEPT.split(",").includes(file.type)) throw new Error("IMAGE_TYPE")
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    })
    try {
      assertDimensions(bitmap.width, bitmap.height)
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      }
    } catch (error) {
      bitmap.close()
      throw error
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    assertDimensions(image.naturalWidth, image.naturalHeight)
    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = name
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  // Leave the URL alive until browsers have consumed the download.
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
