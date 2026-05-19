import type { ImageSource } from "./types"

const SVG_MIME = "image/svg+xml"

function isSvgFile(file: File): boolean {
  if (file.type === SVG_MIME) {
    return true
  }

  return file.name.toLowerCase().endsWith(".svg")
}

/* v8 ignore start -- DOM/Image APIs unavailable in headless test environment */

async function readSvgText(file: File): Promise<string> {
  return file.text()
}

function decodeImage(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(new Error("INVALID_IMAGE"))
    }
    image.src = objectUrl
  })
}

async function loadImageSource(file: File): Promise<ImageSource> {
  if (!file.type.startsWith("image/") && !isSvgFile(file)) {
    throw new Error("INVALID_IMAGE")
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await decodeImage(objectUrl)
    const isSvg = isSvgFile(file)
    const svgText = isSvg ? await readSvgText(file) : null
    const width = image.naturalWidth || (isSvg ? 256 : 0)
    const height = image.naturalHeight || (isSvg ? 256 : 0)

    if (width === 0 || height === 0) {
      URL.revokeObjectURL(objectUrl)
      throw new Error("INVALID_IMAGE")
    }

    return {
      file,
      width,
      height,
      mimeType: file.type || (isSvg ? SVG_MIME : "application/octet-stream"),
      isSvg,
      svgText,
      objectUrl,
      image,
    }
  } catch (cause) {
    URL.revokeObjectURL(objectUrl)
    throw cause
  }
}

function disposeImageSource(source: ImageSource | null): void {
  if (source) {
    URL.revokeObjectURL(source.objectUrl)
  }
}

/* v8 ignore stop */

export { disposeImageSource, isSvgFile, loadImageSource, SVG_MIME }
