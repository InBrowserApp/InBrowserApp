import { unzipSync } from "fflate"
import proj4 from "proj4"
import { parseDbf, parseShp } from "shpjs"
import { positionsOf } from "@workspace/geospatial/geojson"
import type { Feature, Geometry, GeoJsonProperties } from "geojson"

type LayerFeature = Feature<Geometry | null>
type Input = { name: string; bytes: ArrayBuffer }
type Layer = {
  name: string
  features: LayerFeature[]
  placement: "exact" | "assumed" | "unmapped" | "empty"
}

const supported = /\.(shp|dbf|prj|cpg)$/i
const decoder = new TextDecoder()

function supportedEntry(name: string) {
  return supported.test(name) && !/(^|\/)(__MACOSX|\._)/.test(name)
}

function expandArchive({ bytes }: Input): Input[] {
  const files = unzipSync(new Uint8Array(bytes), {
    filter: ({ name }) => supportedEntry(name),
  })
  return Object.entries(files).map(([name, data]) => ({
    name,
    bytes: data.buffer,
  }))
}

function companion(
  entries: ReadonlyMap<string, ArrayBuffer>,
  name: string,
  allowFolded: boolean
) {
  const exact = entries.get(name)
  if (exact || !allowFolded) return exact
  const folded = name.toLowerCase()
  let match: ArrayBuffer | undefined
  for (const [key, bytes] of entries) {
    if (key.toLowerCase() !== folded) continue
    if (match) return undefined
    match = bytes
  }
  return match
}

const legacyEncoding = new TextEncoder().encode("windows-1252").buffer
const emptyEncoding = new ArrayBuffer(0)

function dateOffsets(view: DataView, headerLength: number) {
  const dates: number[] = []
  let offset = 1
  for (let column = 32; column + 32 < headerLength; column += 32) {
    const width = view.getUint8(column + 16)
    if (view.getUint8(column + 11) === 68) dates.push(offset)
    offset += width
  }
  return dates
}

function calendarDate(bytes: ArrayBuffer, offset: number) {
  const text = decoder.decode(new Uint8Array(bytes, offset, 8))
  if (!/^\d{8}$/.test(text) || text === "00000000") return null
  return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`
}

function readAttributes(
  bytes: ArrayBuffer,
  encoding: ArrayBuffer | undefined,
  count: number
) {
  const view = new DataView(bytes)
  if (view.byteLength < 33) throw new Error("Invalid DBF header")
  const records = view.getUint32(4, true)
  const start = view.getUint16(8, true)
  const stride = view.getUint16(10, true)
  if (start < 33 || stride < 1 || start + records * stride > view.byteLength)
    throw new Error("Invalid DBF record span")
  if (records !== count)
    throw new Error("Shapefile and DBF record counts differ")

  const codePage =
    encoding ?? (view.getUint8(29) === 0x57 ? legacyEncoding : emptyEncoding)
  const attributes = parseDbf(bytes, codePage)
  const dates = dateOffsets(view, start)
  return attributes.map((properties, index) => {
    const row = start + index * stride
    let dateIndex = 0
    return {
      deleted: view.getUint8(row) === 0x2a,
      properties: Object.fromEntries(
        Object.entries(properties ?? {}).map(([key, value]) => [
          key,
          value instanceof Date
            ? calendarDate(bytes, row + dates[dateIndex++]!)
            : value,
        ])
      ) as GeoJsonProperties,
    }
  })
}

function readLayer(
  shape: Input,
  entries: ReadonlyMap<string, ArrayBuffer>,
  allowFolded: boolean
): Layer {
  const name = shape.name.slice(0, -4)
  const prj = companion(entries, `${name}.prj`, allowFolded)
  const dbf = companion(entries, `${name}.dbf`, allowFolded)
  const cpg = companion(entries, `${name}.cpg`, allowFolded)
  const projection = decoder.decode(prj).trim()
  const header = new DataView(shape.bytes)
  if (shape.bytes.byteLength < 100 || header.getInt32(0) !== 9994)
    throw new Error("Invalid Shapefile header")

  let projectionValid = false
  if (projection) {
    try {
      proj4(projection)
      projectionValid = true
    } catch {
      // Preserve access to attributes even when the CRS cannot be resolved.
    }
  }

  const geometries = parseShp(
    shape.bytes,
    projectionValid ? projection : undefined
  )
  const attributes = dbf ? readAttributes(dbf, cpg, geometries.length) : null

  let hasPositions = false
  let canMap = !prj || projectionValid
  const features: LayerFeature[] = []
  geometries.forEach((geometry, index) => {
    const record = attributes?.[index]
    if (record?.deleted) return
    for (const [lon, lat] of geometry ? positionsOf(geometry) : []) {
      hasPositions = true
      if (
        !Number.isFinite(lon) ||
        !Number.isFinite(lat) ||
        Math.abs(lon!) > 180 ||
        Math.abs(lat!) > 90
      )
        canMap = false
    }
    features.push({
      type: "Feature",
      geometry: geometry ?? null,
      properties: record?.properties ?? null,
    })
  })

  const placement = !hasPositions
    ? "empty"
    : !canMap
      ? "unmapped"
      : projectionValid
        ? "exact"
        : "assumed"
  return { name, features, placement }
}

export function readShapefiles(inputs: readonly Input[]): Layer[] {
  const groups = inputs
    .filter(({ name }) => /\.zip$/i.test(name))
    .map(expandArchive)
  groups.push(inputs.filter(({ name }) => supportedEntry(name)))
  const layers = groups.flatMap((files) => {
    const entries = new Map(
      files.map(({ name, bytes }) => [
        name.slice(0, -4) + name.slice(-4).toLowerCase(),
        bytes,
      ])
    )
    const shapes = files.filter(({ name }) => /\.shp$/i.test(name))
    const count = new Map<string, number>()
    for (const { name } of shapes) {
      const key = name.toLowerCase()
      count.set(key, (count.get(key) ?? 0) + 1)
    }
    return shapes.map((shape) =>
      readLayer(shape, entries, count.get(shape.name.toLowerCase()) === 1)
    )
  })
  if (!layers.length) throw new Error("No Shapefile geometry found")
  return layers
}
