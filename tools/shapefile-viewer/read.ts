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

function companion(entries: ReadonlyMap<string, ArrayBuffer>, name: string) {
  const exact = entries.get(name)
  if (exact) return exact
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

function calendarDate(value: Date) {
  if (!Number.isFinite(value.getTime())) return null
  return [
    String(value.getFullYear()).padStart(4, "0"),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-")
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
  return attributes.map((properties, index) => ({
    deleted: view.getUint8(start + index * stride) === 0x2a,
    properties: Object.fromEntries(
      Object.entries(properties ?? {}).map(([key, value]) => [
        key,
        value instanceof Date ? calendarDate(value) : value,
      ])
    ) as GeoJsonProperties,
  }))
}

function readLayer(
  shape: Input,
  entries: ReadonlyMap<string, ArrayBuffer>
): Layer {
  const name = shape.name.slice(0, -4)
  const prj = companion(entries, `${name}.prj`)
  const dbf = companion(entries, `${name}.dbf`)
  const cpg = companion(entries, `${name}.cpg`)
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
    return files
      .filter(({ name }) => /\.shp$/i.test(name))
      .map((shape) => readLayer(shape, entries))
  })
  if (!layers.length) throw new Error("No Shapefile geometry found")
  return layers
}
