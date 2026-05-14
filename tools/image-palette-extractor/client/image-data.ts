type LoadedImageData = Readonly<{
  imageData: ImageData
  width: number
  height: number
  sampleWidth: number
  sampleHeight: number
}>

type ImageSource = CanvasImageSource & {
  width: number
  height: number
}

async function loadImageData(
  file: File,
  maxDimension: number
): Promise<LoadedImageData> {
  const { image, width, height, revoke } = await loadImageSource(file)
  const { targetWidth, targetHeight } = scaleDimensions(
    width,
    height,
    maxDimension
  )
  const canvas = document.createElement("canvas")
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) {
    revoke()
    throw new Error("CANVAS_UNAVAILABLE")
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)
  const imageData = context.getImageData(0, 0, targetWidth, targetHeight)
  revoke()

  return {
    imageData,
    width,
    height,
    sampleWidth: targetWidth,
    sampleHeight: targetHeight,
  }
}

async function loadImageSource(file: File) {
  const isSvg = isSvgFile(file)

  if (!isSvg && "createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      return {
        image: bitmap as ImageSource,
        width: bitmap.width,
        height: bitmap.height,
        revoke: () => {
          bitmap.close()
        },
      }
    } catch {
      // Fall through to HTMLImageElement decoding for unsupported formats.
    }
  }

  return loadImageElement(file, isSvg)
}

async function loadImageElement(file: File, isSvg: boolean) {
  const url = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => {
        resolve(element)
      }
      element.onerror = () => {
        reject(new Error("IMAGE_LOAD_FAILED"))
      }
      element.src = url
    })
    const fallback = isSvg ? await resolveSvgDimensions(file) : null
    const width = image.naturalWidth || fallback?.width || 300
    const height = image.naturalHeight || fallback?.height || 150

    image.width = width
    image.height = height

    return {
      image,
      width,
      height,
      revoke: () => {
        URL.revokeObjectURL(url)
      },
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

function isImageFile(file: File | null) {
  if (!file) return false
  if (file.type.startsWith("image/")) return true

  return [
    ".avif",
    ".bmp",
    ".gif",
    ".heic",
    ".heif",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".svgz",
    ".tif",
    ".tiff",
    ".webp",
  ].some((extension) => file.name.toLowerCase().endsWith(extension))
}

function isSvgFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    file.type === "image/svg+xml" ||
    name.endsWith(".svg") ||
    name.endsWith(".svgz")
  )
}

async function resolveSvgDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  try {
    const text = await file.text()
    const svgMatch = text.match(/<svg[^>]*>/i)
    if (!svgMatch) return null

    const tag = svgMatch[0]
    const width = parseSvgLength(getSvgAttribute(tag, "width"))
    const height = parseSvgLength(getSvgAttribute(tag, "height"))
    const viewBox = getSvgAttribute(tag, "viewBox")

    if (width && height) return { width, height }
    if (!viewBox) return null

    const parts = viewBox.trim().split(/[\s,]+/)
    if (parts.length !== 4) return null

    const viewWidth = Number.parseFloat(parts[2] ?? "")
    const viewHeight = Number.parseFloat(parts[3] ?? "")

    if (!Number.isFinite(viewWidth) || !Number.isFinite(viewHeight)) {
      return null
    }

    if (width && viewHeight > 0) return { width, height: viewHeight }
    if (height && viewWidth > 0) return { width: viewWidth, height }
    if (viewWidth > 0 && viewHeight > 0) {
      return { width: viewWidth, height: viewHeight }
    }
  } catch {
    return null
  }

  return null
}

function getSvgAttribute(tag: string, name: string): string | null {
  return tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, "i"))?.[1] ?? null
}

function parseSvgLength(value: string | null): number | null {
  if (!value) return null

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function scaleDimensions(width: number, height: number, maxDimension: number) {
  const maxSide = Math.max(width, height)

  if (maxSide <= maxDimension) {
    return { targetWidth: width, targetHeight: height }
  }

  const scale = maxDimension / maxSide

  return {
    targetWidth: Math.max(1, Math.round(width * scale)),
    targetHeight: Math.max(1, Math.round(height * scale)),
  }
}

export { isImageFile, loadImageData, scaleDimensions }
