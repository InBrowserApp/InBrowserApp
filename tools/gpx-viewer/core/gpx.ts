import { parseXml } from "@workspace/geospatial/xml"
import {
  gpxChildren as children,
  readGpxPosition as position,
} from "@workspace/geospatial/gpx"
import type { GpxPoint as Point } from "@workspace/geospatial/gpx"
import type { Feature } from "geojson"

type Sample = Point & Readonly<{ distance: number; elevation: number }>

function distanceBetween(first: Point, second: Point) {
  const radians = Math.PI / 180
  const sinLat = Math.sin(((second.lat - first.lat) * radians) / 2)
  const sinLon = Math.sin(((second.lon - first.lon) * radians) / 2)
  const h =
    sinLat ** 2 +
    sinLon ** 2 * Math.cos(first.lat * radians) * Math.cos(second.lat * radians)
  return 2 * 6371008.8 * Math.asin(Math.sqrt(Math.min(1, h)))
}

function summarize(segments: Point[][]) {
  const profile: Sample[][] = []
  let distance = 0
  let ascent = 0
  let descent = 0
  for (const segment of segments) {
    let previous: Point | undefined
    let line: Sample[] = []
    for (const point of segment) {
      if (previous) distance += distanceBetween(previous, point)
      if (point.elevation !== undefined) {
        if (previous?.elevation !== undefined) {
          const change = point.elevation - previous.elevation
          ascent += Math.max(0, change)
          descent += Math.max(0, -change)
        }
        line.push({ ...point, distance, elevation: point.elevation })
      } else if (line.length) {
        profile.push(line)
        line = []
      }
      previous = point
    }
    if (line.length) profile.push(line)
  }
  return { distance, ascent, descent, profile }
}

function parseGpx(text: string) {
  const root = parseXml(text, "gpx").documentElement
  const segments = [
    ...children(root, "trk").flatMap((track) =>
      children(track, "trkseg").map((segment) =>
        children(segment, "trkpt").map(position)
      )
    ),
    ...children(root, "rte").map((route) =>
      children(route, "rtept").map(position)
    ),
  ].filter((segment) => segment.length)
  const waypoints = children(root, "wpt").map((node) => ({
    point: position(node),
    name: children(node, "name")[0]?.textContent?.trim(),
  }))
  if (!segments.length && !waypoints.length) throw new Error("Empty GPX")

  const center = segments[0]?.[0]?.lon ?? waypoints[0]!.point.lon
  function nearestLongitude(lon: number, reference: number) {
    return lon + 360 * Math.round((reference - lon) / 360)
  }
  const continuous = segments.map((segment) => {
    let reference = center
    return segment.map((point) => {
      const lon = nearestLongitude(point.lon, reference)
      reference = lon
      return { ...point, lon }
    })
  })
  const features: Feature[] = [
    ...continuous.map((segment): Feature => {
      const coordinates = segment.map(({ lon, lat }) => [lon, lat])
      return {
        type: "Feature",
        properties: null,
        geometry:
          coordinates.length === 1
            ? { type: "Point", coordinates: coordinates[0]! }
            : { type: "LineString", coordinates },
      }
    }),
    ...waypoints.map(({ point }): Feature => ({
      type: "Feature",
      properties: null,
      geometry: {
        type: "Point",
        coordinates: [nearestLongitude(point.lon, center), point.lat],
      },
    })),
  ]
  return { features, waypoints, ...summarize(continuous) }
}

export { parseGpx }
export type { Sample }
