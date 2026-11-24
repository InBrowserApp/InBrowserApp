import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt"
import {
  featuresOf,
  geoJsonValue,
  parseGeoJson,
  positionsOf,
} from "@workspace/geospatial/geojson"
import type { Geometry } from "geojson"

function plainGeometry(geometry: Geometry): Geometry {
  if (geometry.type === "GeometryCollection") {
    return {
      type: geometry.type,
      geometries: geometry.geometries.map(plainGeometry),
    }
  }
  const { type, coordinates } = geometry
  const positions = positionsOf(geometry)
  const dimension = positions[0]?.length
  if (
    positions.some(
      (position) => position.length !== dimension || position.length > 3
    )
  ) {
    throw new Error("Use consistent 2D or 3D coordinates")
  }
  return { type, coordinates } as Geometry
}

function writeWkt(geometry: Geometry): string {
  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.length
      ? `GEOMETRYCOLLECTION (${geometry.geometries.map(writeWkt).join(", ")})`
      : "GEOMETRYCOLLECTION EMPTY"
  }
  return geojsonToWKT(geometry)
}

function convert(input: string, reverse: boolean) {
  if (!reverse) {
    const wkt = input.toUpperCase()
    if (/\b(?:M|ZM)\b/.test(wkt) || /\bPOINT\s*(?:Z\s*)?\([^)]*,/.test(wkt)) {
      throw new Error("Use a 2D or 3D WKT geometry")
    }
    const parsed = geoJsonValue(wktToGeoJSON(wkt))
    return JSON.stringify(plainGeometry(parsed as Geometry), null, 2)
  }

  const geometries = featuresOf(parseGeoJson(input)).flatMap(({ geometry }) =>
    geometry ? [plainGeometry(geometry)] : []
  )
  return writeWkt(
    geometries.length === 1
      ? geometries[0]!
      : { type: "GeometryCollection", geometries }
  )
}

export { convert }
