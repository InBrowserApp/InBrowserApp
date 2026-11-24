import type { Feature, FeatureCollection, Geometry, Position } from "geojson"

type GeoJsonFeature = Feature<Geometry | null>
type GeoJson = FeatureCollection<Geometry | null> | GeoJsonFeature | Geometry

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isPosition(value: unknown): value is Position {
  return (
    Array.isArray(value) && value.length >= 2 && value.every(Number.isFinite)
  )
}

function isLine(value: unknown): value is Position[] {
  return Array.isArray(value) && value.length >= 2 && value.every(isPosition)
}

function isRing(value: unknown) {
  if (!isLine(value) || value.length < 4) return false
  const first = value[0]!
  const last = value.at(-1)!
  return (
    first.length === last.length &&
    first.every((number, index) => number === last[index])
  )
}

function isPolygon(value: unknown) {
  return Array.isArray(value) && value.length > 0 && value.every(isRing)
}

function isGeometry(value: unknown): value is Geometry {
  if (!isRecord(value)) return false
  const { coordinates } = value
  if (value.type === "GeometryCollection") {
    return Array.isArray(value.geometries) && value.geometries.every(isGeometry)
  }
  if (!Array.isArray(coordinates)) return false
  const empty = coordinates.length === 0
  switch (value.type) {
    case "Point":
      return empty || isPosition(coordinates)
    case "MultiPoint":
      return coordinates.every(isPosition)
    case "LineString":
      return empty || isLine(coordinates)
    case "Polygon":
      return empty || isPolygon(coordinates)
    case "MultiLineString":
      return coordinates.every(isLine)
    case "MultiPolygon":
      return coordinates.every(isPolygon)
    default:
      return false
  }
}

function isFeature(value: unknown): value is GeoJsonFeature {
  return (
    isRecord(value) &&
    value.type === "Feature" &&
    (value.geometry === null || isGeometry(value.geometry)) &&
    (value.properties === null || isRecord(value.properties))
  )
}

function geoJsonValue(value: unknown): GeoJson {
  if (
    isRecord(value) &&
    value.type === "FeatureCollection" &&
    Array.isArray(value.features) &&
    value.features.every(isFeature)
  )
    return { ...value, type: "FeatureCollection", features: value.features }
  if (isFeature(value) || isGeometry(value)) return value
  throw new Error("Invalid GeoJSON")
}

function parseGeoJson(text: string): GeoJson {
  return geoJsonValue(JSON.parse(text))
}

function featuresOf(value: GeoJson): GeoJsonFeature[] {
  if (value.type === "FeatureCollection") return value.features
  if (value.type === "Feature") return [value]
  return [{ type: "Feature", geometry: value, properties: null }]
}

function positionsOf(geometry: Geometry): Position[] {
  switch (geometry.type) {
    case "Point":
      return geometry.coordinates.length ? [geometry.coordinates] : []
    case "MultiPoint":
    case "LineString":
      return geometry.coordinates
    case "MultiLineString":
    case "Polygon":
      return geometry.coordinates.flat()
    case "MultiPolygon":
      return geometry.coordinates.flat(2)
    case "GeometryCollection":
      return geometry.geometries.flatMap(positionsOf)
  }
}

export { featuresOf, geoJsonValue, parseGeoJson, positionsOf }
