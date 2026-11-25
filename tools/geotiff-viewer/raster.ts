import { fromBlob, globals } from "geotiff"
import type { GeoTIFF, GeoTIFFImage } from "geotiff"

const photo = globals.photometricInterpretations
const previewEdge = 1400
const colorModels: readonly number[] = [
  photo.RGB,
  photo.Palette,
  photo.YCbCr,
  photo.CMYK,
  photo.CIELab,
]
const photometricOf = (image: GeoTIFFImage) =>
  image.getFileDirectory().getValue("PhotometricInterpretation")

function boundsOf(image: GeoTIFFImage, point: boolean): number[] | null {
  const tags = image.getFileDirectory()
  const matrix = tags.getValue("ModelTransformation")
  const tie = tags.getValue("ModelTiepoint")
  const scale = tags.getValue("ModelPixelScale")
  const shift = point ? -0.5 : 0
  const left = shift
  const top = shift
  const right = image.getWidth() + shift
  const bottom = image.getHeight() + shift
  let corners: number[][]
  if (matrix?.length === 16) {
    const [xx, xy, , x0, yx, yy, , y0] = matrix as ArrayLike<number> &
      Iterable<number>
    corners = [
      [left, top],
      [right, top],
      [left, bottom],
      [right, bottom],
    ].map(([x, y]) => [xx! * x! + xy! * y! + x0!, yx! * x! + yy! * y! + y0!])
  } else if (tie && tie.length >= 6 && scale && scale.length >= 2) {
    const x = (i: number) => tie[3]! + (i - tie[0]!) * scale[0]!
    const y = (j: number) => tie[4]! - (j - tie[1]!) * scale[1]!
    corners = [
      [x(left), y(top)],
      [x(right), y(bottom)],
    ]
  } else {
    return null
  }
  const xs = corners.map(([x]) => x!)
  const ys = corners.map(([, y]) => y!)
  const bounds = [
    Math.min(...xs),
    Math.min(...ys),
    Math.max(...xs),
    Math.max(...ys),
  ]
  return bounds.every(Number.isFinite) ? bounds : null
}

async function overviewOf(
  tiff: GeoTIFF,
  original: GeoTIFFImage,
  target: number
) {
  let best = original
  let bestSize = Math.max(original.getWidth(), original.getHeight())
  if (bestSize <= target) return best
  const count = await tiff.getImageCount()
  for (let index = 1; index < count; index++) {
    const candidate = await tiff.getImage(index)
    const tags = candidate.getFileDirectory()
    const type = tags.getValue("NewSubfileType") ?? 0
    if (type & 4 || (!(type & 1) && tags.getValue("SubfileType") !== 2))
      continue
    if (
      candidate.getSamplesPerPixel() !== original.getSamplesPerPixel() ||
      photometricOf(candidate) !== photometricOf(original)
    )
      continue
    const width = candidate.getWidth()
    const height = candidate.getHeight()
    const expected = (original.getWidth() * height) / original.getHeight()
    if (Math.abs(width - expected) > Math.max(2, expected * 0.01)) continue
    const size = Math.max(width, height)
    if (size >= target && size < bestSize) {
      best = candidate
      bestSize = size
    }
  }
  return best
}

export type RasterDetails = {
  width: number
  height: number
  bands: number
  color: boolean
  crs: string | null
  bounds: number[] | null
  noData: number | null
}

export type RasterPreview = {
  details: RasterDetails
  width: number
  height: number
  pixels: Uint8ClampedArray<ArrayBuffer>
  band: number
}

function detailsOf(image: GeoTIFFImage): RasterDetails {
  const photometric = photometricOf(image)
  const keys = image.getGeoKeys()
  const epsg =
    keys?.ProjectedCSTypeGeoKey ??
    (keys?.GTModelTypeGeoKey !== 1 ? keys?.GeographicTypeGeoKey : undefined)
  return {
    width: image.getWidth(),
    height: image.getHeight(),
    bands: image.getSamplesPerPixel(),
    color:
      photometric !== undefined &&
      colorModels.includes(photometric) &&
      (photometric !== photo.RGB || image.getSampleFormat(0) === 1),
    crs:
      typeof epsg === "number" && epsg > 0 && epsg !== 32767
        ? `EPSG:${epsg}`
        : null,
    bounds: boundsOf(image, keys?.GTRasterTypeGeoKey === 2),
    noData: image.getGDALNoData(),
  }
}

function grayscale(
  samples: ArrayLike<number>,
  noData: number | null,
  invert: boolean
) {
  const missing =
    samples instanceof Float32Array && noData !== null
      ? Math.fround(noData)
      : noData
  const pixels = new Uint8ClampedArray(samples.length * 4)
  let low = Infinity
  let high = -Infinity
  for (let index = 0; index < samples.length; index++) {
    const value = samples[index]!
    if (Number.isFinite(value) && value !== missing) {
      low = Math.min(low, value)
      high = Math.max(high, value)
      pixels[index * 4 + 3] = 255
    }
  }
  const range = high - low
  for (let index = 0; index < samples.length; index++) {
    const offset = index * 4
    if (!pixels[offset + 3]) continue
    const shade = range ? ((samples[index]! - low) / range) * 255 : 128
    pixels[offset] =
      pixels[offset + 1] =
      pixels[offset + 2] =
        invert ? 255 - shade : shade
  }
  return pixels
}

export async function readRaster(
  file: Blob,
  selected?: number
): Promise<RasterPreview> {
  const tiff = await fromBlob(file)
  const original = await tiff.getImage()
  const details = detailsOf(original)
  const band = selected ?? (details.color ? -1 : 0)
  const factor = Math.min(
    1,
    previewEdge / Math.max(details.width, details.height)
  )
  const width = Math.max(1, Math.round(details.width * factor))
  const height = Math.max(1, Math.round(details.height * factor))
  const image = await overviewOf(tiff, original, previewEdge)
  const size = { width, height, interleave: true as const }
  const photometric = photometricOf(image)

  if (band >= 0) {
    const samples = await image.readRasters({ ...size, samples: [band] })
    const pixels = grayscale(
      samples,
      details.noData,
      photometric === photo.WhiteIsZero && band === 0
    )
    return { details, width, height, band, pixels }
  }

  const rgb = photometric === photo.RGB
  const alpha = rgb
    ? image.getFileDirectory().getValue("ExtraSamples")?.[0]
    : undefined
  const withAlpha = alpha === 1 || alpha === 2
  const colors = rgb
    ? await image.readRasters({
        ...size,
        samples: withAlpha ? [0, 1, 2, 3] : [0, 1, 2],
      })
    : await image.readRGB(size)
  const pixels = new Uint8ClampedArray(width * height * 4)
  const stride = withAlpha ? 4 : 3
  const multiplier = rgb ? 255 / (2 ** image.getBitsPerSample(0) - 1) : 1
  const alphaScale = withAlpha ? 255 / (2 ** image.getBitsPerSample(3) - 1) : 1
  for (let index = 0; index < width * height; index++) {
    const offset = index * stride
    const red = colors[offset]!
    const green = colors[offset + 1]!
    const blue = colors[offset + 2]!
    if (rgb && red === details.noData && green === red && blue === red) continue
    const opacity = withAlpha ? colors[offset + 3]! * alphaScale : 255
    const unpremultiply = alpha === 1 && opacity ? 255 / opacity : 1
    pixels[index * 4] = red * multiplier * unpremultiply
    pixels[index * 4 + 1] = green * multiplier * unpremultiply
    pixels[index * 4 + 2] = blue * multiplier * unpremultiply
    pixels[index * 4 + 3] = opacity
  }
  return { details, width, height, band, pixels }
}
