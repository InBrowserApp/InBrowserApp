import {
  gpxChildren as children,
  readGpxPosition,
} from "@workspace/geospatial/gpx"
import { parseXml } from "@workspace/geospatial/xml"
import type {
  Feature,
  FeatureCollection,
  Geometry,
  LineString,
  Point,
  Position,
} from "geojson"

type Sample = { position: Position; time?: string }
type Kind = "track" | "route" | "waypoint"

function text(element: Element, name: string) {
  return children(element, name)[0]?.textContent?.trim()
}

function sample(element: Element): Sample {
  const { lon, lat, elevation } = readGpxPosition(element)
  const position = elevation === undefined ? [lon, lat] : [lon, lat, elevation]
  return { position, time: text(element, "time") || undefined }
}

function splitAtDateline(points: Sample[]): Sample[][] {
  let current = [points[0]!]
  const parts = [current]
  for (const point of points.slice(1)) {
    const [from, startY, startZ] = current.at(-1)!.position
    const [to, endY, endZ] = point.position
    if (Math.abs(to! - from!) <= 180) {
      current.push(point)
      continue
    }
    const edge = from! > 0 ? 180 : -180
    const unwrapped = to! + 2 * edge
    if (from === unwrapped) {
      current.push({ ...point, position: [edge, ...point.position.slice(1)] })
      continue
    }
    const fraction = (edge - from!) / (unwrapped - from!)
    const ordinates = [startY! + fraction * (endY! - startY!)]
    if (startZ !== undefined && endZ !== undefined)
      ordinates.push(startZ + fraction * (endZ - startZ))
    if (from !== edge) current.push({ position: [edge, ...ordinates] })
    current =
      to === -edge ? [point] : [{ position: [-edge, ...ordinates] }, point]
    parts.push(current)
  }
  return parts
}

function shape(positions: Position[]): Point | LineString {
  return positions.length === 1
    ? { type: "Point", coordinates: positions[0]! }
    : { type: "LineString", coordinates: positions }
}

function feature(element: Element, kind: Kind, segments: Sample[][]): Feature {
  const groups = segments.flatMap(splitAtDateline)
  const parts = groups.map((points) =>
    shape(points.map(({ position }) => position))
  )
  let geometry: Geometry
  if (parts.length === 1) geometry = parts[0]!
  else if (
    parts.every((part): part is LineString => part.type === "LineString")
  )
    geometry = {
      type: "MultiLineString",
      coordinates: parts.map(({ coordinates }) => coordinates),
    }
  else geometry = { type: "GeometryCollection", geometries: parts }

  const properties: Record<string, unknown> = { gpxType: kind }
  for (const field of ["name", "desc", "cmt", "type", "sym", "src"]) {
    const value = text(element, field)
    if (value) properties[field] = value
  }
  if (geometry.type === "Point") {
    const time = groups[0]?.[0]?.time
    if (time) properties.time = time
  } else {
    const times = groups.map((points) =>
      points.map((point) => point.time ?? null)
    )
    if (times.some((segment) => segment.some(Boolean)))
      properties.coordinateProperties = {
        times: times.length === 1 ? times[0] : times,
      }
  }
  return { type: "Feature", geometry, properties }
}

export function convertGpx(input: string) {
  const root = parseXml(input, "gpx").documentElement
  const features: Feature[] = []
  for (const element of root.children) {
    if (element.namespaceURI !== root.namespaceURI) continue
    if (element.localName === "wpt") {
      features.push(feature(element, "waypoint", [[sample(element)]]))
    } else if (element.localName === "rte") {
      const points = children(element, "rtept").map(sample)
      if (points.length) features.push(feature(element, "route", [points]))
    } else if (element.localName === "trk") {
      const segments = children(element, "trkseg")
        .map((segment) => children(segment, "trkpt").map(sample))
        .filter((points) => points.length > 0)
      if (segments.length) features.push(feature(element, "track", segments))
    }
  }
  const result: FeatureCollection = { type: "FeatureCollection", features }
  return JSON.stringify(result, null, 2)
}

export async function readGpxFile(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const little =
    (bytes[0] === 0xff && bytes[1] === 0xfe) ||
    (bytes[0] === 0x3c && bytes[1] === 0)
  const big =
    (bytes[0] === 0xfe && bytes[1] === 0xff) ||
    (bytes[0] === 0 && bytes[1] === 0x3c)
  return new TextDecoder(
    little ? "utf-16le" : big ? "utf-16be" : "utf-8"
  ).decode(bytes)
}
