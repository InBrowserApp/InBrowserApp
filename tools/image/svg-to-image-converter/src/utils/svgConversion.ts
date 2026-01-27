export type SvgDimensions = { width: number; height: number }
export type OutputFormat = 'png' | 'jpeg' | 'webp'

export function normalizeBackgroundColor(value: string, formatValue: OutputFormat) {
  if (formatValue !== 'jpeg') return value
  if (value.startsWith('#') && value.length === 9) {
    return value.slice(0, 7)
  }
  return value
}

export function resolveOutputSize(
  svgDimensions: SvgDimensions | null,
  width: number,
  height: number,
) {
  const base = svgDimensions ?? { width: 512, height: 512 }
  const outputWidth = width > 0 ? width : Math.round(base.width)
  const outputHeight = height > 0 ? height : Math.round(base.height)

  return {
    width: Math.max(1, Math.round(outputWidth)),
    height: Math.max(1, Math.round(outputHeight)),
  }
}

export function getSvgDimensions(svgString: string, invalidSvgMessage: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')

  if (doc.querySelector('parsererror')) {
    throw new Error(invalidSvgMessage)
  }

  const svg = doc.querySelector('svg')
  if (!svg) {
    throw new Error(invalidSvgMessage)
  }

  const widthAttr = parseSvgLength(svg.getAttribute('width'))
  const heightAttr = parseSvgLength(svg.getAttribute('height'))
  const viewBox = parseViewBox(svg.getAttribute('viewBox'))

  let width = widthAttr
  let height = heightAttr

  if (viewBox && (!width || !height)) {
    if (!width && height) {
      width = (height * viewBox.width) / viewBox.height
    } else if (!height && width) {
      height = (width * viewBox.height) / viewBox.width
    }
  }

  if (viewBox && (!width || !height)) {
    width = width || viewBox.width
    height = height || viewBox.height
  }

  if (!width || !height) {
    return { width: 512, height: 512 }
  }

  return { width, height }
}

export function loadSvgImage(svgString: string, imageLoadFailedMessage: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(imageLoadFailedMessage))
    image.src = buildSvgDataUrl(svgString)
  })
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number | undefined,
  convertFailedMessage: string,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(convertFailedMessage))
          return
        }
        resolve(blob)
      },
      type,
      quality,
    )
  })
}

export function buildSvgDataUrl(svgString: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
}

export function parseSvgLength(value: string | null) {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed || trimmed.endsWith('%')) return null

  const match = trimmed.match(/^([0-9.]+)(px)?$/i)
  if (!match) return null

  const parsed = Number(match[1])
  if (!Number.isFinite(parsed) || parsed <= 0) return null

  return parsed
}

export function parseViewBox(value: string | null) {
  if (!value) return null

  const parts = value
    .trim()
    .split(/[\s,]+/)
    .map((part) => Number(part))

  if (parts.length < 4 || parts.some((part) => Number.isNaN(part))) return null

  const width = parts[2] as number
  const height = parts[3] as number

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null

  return { width, height }
}
