import { expect, it } from "vitest"
import { convert } from "./convert"

it("converts points, elevation, polygon rings, multi-points and collections", () => {
  expect(JSON.parse(convert("POINT Z (139 35 24)", false))).toEqual({
    type: "Point",
    coordinates: [139, 35, 24],
  })
  expect(JSON.parse(convert("MULTIPOINT ((1 2), (3 4))", false))).toEqual({
    type: "MultiPoint",
    coordinates: [
      [1, 2],
      [3, 4],
    ],
  })
  const collection =
    "GEOMETRYCOLLECTION (POINT (1 2), POLYGON ((0 0, 1 0, 1 1, 0 0)))"
  expect(convert(convert(collection, false), true)).toBe(collection)
})

it("preserves empty geometry types and converts features without attributes", () => {
  expect(convert(convert("POINT EMPTY", false), true)).toBe("POINT EMPTY")
  expect(convert(convert("GEOMETRYCOLLECTION EMPTY", false), true)).toBe(
    "GEOMETRYCOLLECTION EMPTY"
  )
  const feature = {
    type: "Feature",
    properties: { name: "a" },
    geometry: { type: "Point", coordinates: [1, 2] },
  }
  const other = { ...feature, geometry: { type: "Point", coordinates: [3, 4] } }
  const empty = { ...feature, geometry: null }
  expect(convert(JSON.stringify(feature), true)).toBe("POINT (1 2)")
  expect(convert(JSON.stringify(empty), true)).toBe("GEOMETRYCOLLECTION EMPTY")
  expect(
    convert(
      JSON.stringify({
        type: "FeatureCollection",
        features: [feature, empty, other],
      }),
      true
    )
  ).toBe("GEOMETRYCOLLECTION (POINT (1 2), POINT (3 4))")
})

it("rejects malformed input and WKT measure ordinates", () => {
  expect(() => convert("point (hello)", false)).toThrow("Unable to parse")
  expect(() => convert("POINT M (1 2 3)", false)).toThrow(
    "Use a 2D or 3D WKT geometry"
  )
  expect(() => convert('{"type":"Point","coordinates":["1",2]}', true)).toThrow(
    "Invalid GeoJSON"
  )
})

it("accepts lowercase, rejects extra point tuples and mixed or measured ordinates", () => {
  expect(JSON.parse(convert("point (1 2)", false))).toEqual({
    type: "Point",
    coordinates: [1, 2],
  })
  for (const wkt of [
    "POINT (1 2, 3 4)",
    "POINT (1 2 3 4)",
    "LINESTRING (1 2)",
    "LINESTRING (1 2, 3 4 5)",
    "POLYGON ((0 0, 1 0, 1 1, 1 0))",
  ]) {
    expect(() => convert(wkt, false)).toThrow(/.+/)
  }
  expect(() =>
    convert('{"type":"Point","coordinates":[1,2,3,4]}', true)
  ).toThrow("Use consistent 2D or 3D coordinates")
})
