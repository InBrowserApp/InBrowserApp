export const QUALITY_PRESETS = {
  fast: { maxDimension: 360, targetSamples: 20000 },
  balanced: { maxDimension: 720, targetSamples: 60000 },
  precise: { maxDimension: 1200, targetSamples: 140000 },
} as const

export async function loadImageData(file: File, maxDimension: number) {
  const { image, width, height, revoke } = await loadImageSource(file)
  const { targetWidth, targetHeight } = scaleDimensions(width, height, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    revoke?.()
    throw new Error('canvas')
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight)
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
  revoke?.()

  return { imageData, width, height }
}

async function loadImageSource(file: File) {
  const isSvg = isSvgFile(file)
  if (!isSvg && 'createImageBitmap' in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        revoke: () => bitmap.close?.(),
      }
    } catch {
      // Fallback to <img> decoding for unsupported formats.
    }
  }

  return loadImageElement(file, isSvg)
}

async function loadImageElement(file: File, isSvg: boolean) {
  const url = URL.createObjectURL(file)
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image-load'))
    img.src = url
  })

  let width = image.naturalWidth
  let height = image.naturalHeight

  if ((!width || !height) && isSvg) {
    const fallback = await resolveSvgDimensions(file)
    if (fallback) {
      width = fallback.width
      height = fallback.height
      image.width = width
      image.height = height
    }
  }

  if (!width || !height) {
    width = width || 300
    height = height || 150
  }

  return {
    image,
    width,
    height,
    revoke: () => URL.revokeObjectURL(url),
  }
}

function isSvgFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return file.type === 'image/svg+xml' || name.endsWith('.svg') || name.endsWith('.svgz')
}

async function resolveSvgDimensions(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const text = await file.text()
    const svgMatch = text.match(/<svg[^>]*>/i)
    if (!svgMatch) return null
    const tag = svgMatch[0]
    const width = parseSvgLength(getSvgAttribute(tag, 'width'))
    const height = parseSvgLength(getSvgAttribute(tag, 'height'))

    const viewBox = getSvgAttribute(tag, 'viewBox')
    if (width && height) return { width, height }
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/)
      if (parts.length === 4) {
        const viewWidth = Number.parseFloat(parts[2] ?? '')
        const viewHeight = Number.parseFloat(parts[3] ?? '')
        if (!width && Number.isFinite(viewWidth) && viewWidth > 0 && viewHeight > 0) {
          return { width: viewWidth, height: viewHeight }
        }
        if (width && Number.isFinite(viewHeight) && viewHeight > 0) {
          return { width, height: viewHeight }
        }
        if (height && Number.isFinite(viewWidth) && viewWidth > 0) {
          return { width: viewWidth, height }
        }
      }
    }

    if (width && height) return { width, height }
  } catch {
    return null
  }
  return null
}

function getSvgAttribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\\\s${name}=["']([^"']+)["']`, 'i'))
  return match?.[1] ?? null
}

function parseSvgLength(value: string | null): number | null {
  if (!value) return null
  const match = value.match(/([0-9.]+)/)
  const numberMatch = match?.[1]
  if (!numberMatch) return null
  const parsed = Number.parseFloat(numberMatch)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
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
