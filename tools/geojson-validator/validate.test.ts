import { expect, test } from "vitest"
import { validateGeoJson } from "./validate"

test("accepts standard empty objects and antimeridian bounds", () => {
  expect(validateGeoJson('{"type":"FeatureCollection","features":[]}')).toEqual(
    {
      kind: "valid",
      type: "FeatureCollection",
      features: 0,
    }
  )
  expect(
    validateGeoJson(
      '{"type":"Feature","geometry":null,"properties":null,"id":"survey"}'
    )
  ).toEqual({
    kind: "valid",
    type: "Feature",
    features: 1,
  })
  expect(
    validateGeoJson(
      '{"type":"MultiPoint","coordinates":[[179,25],[-179,28]],"bbox":[179,25,-179,28]}'
    )
  ).toMatchObject({
    kind: "valid",
    type: "MultiPoint",
  })
})

test("reports nested feature fields and precise out-of-range ordinates", () => {
  expect(
    validateGeoJson(
      JSON.stringify({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: true,
            properties: [],
            geometry: {
              type: "GeometryCollection",
              geometries: [{ type: "Point", coordinates: [181, -91] }],
            },
          },
        ],
      })
    )
  ).toEqual({
    kind: "invalid",
    limited: false,
    issues: [
      { path: "$.features[0].properties", code: "properties" },
      { path: "$.features[0].id", code: "id" },
      {
        path: "$.features[0].geometry.geometries[0].coordinates[0]",
        code: "longitude",
      },
      {
        path: "$.features[0].geometry.geometries[0].coordinates[1]",
        code: "latitude",
      },
    ],
  })
})

test("checks line length, polygon closure, and reserved member types", () => {
  expect(
    validateGeoJson(
      JSON.stringify({
        type: "GeometryCollection",
        coordinates: [1, 2],
        geometries: [
          { type: "LineString", coordinates: [[0, 1]] },
          {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
              ],
            ],
          },
        ],
      })
    )
  ).toMatchObject({
    kind: "invalid",
    issues: [
      { path: "$.coordinates", code: "member" },
      { path: "$.geometries[0].coordinates", code: "line" },
      { path: "$.geometries[1].coordinates[0]", code: "closedRing" },
    ],
  })
  expect(
    validateGeoJson('{"type":"Point","coordinates":[0,0],"bbox":[0,1,0,-1]}')
  ).toMatchObject({
    kind: "invalid",
    issues: [{ path: "$.bbox", code: "bbox" }],
  })
})

test("separates syntax issues and bounds the diagnostic list", () => {
  expect(validateGeoJson('{\n"coordinates": [1, 2],\n}')).toMatchObject({
    kind: "syntax",
    line: 3,
    column: 1,
  })
  expect(validateGeoJson('{"type":"Triangle","coordinates":[]}')).toMatchObject(
    {
      kind: "invalid",
      issues: [{ path: "$.type", code: "type" }],
    }
  )
  const source = {
    type: "FeatureCollection",
    features: Array.from({ length: 51 }, () => null),
  }
  const result = validateGeoJson(JSON.stringify(source))
  expect(result).toMatchObject({ kind: "invalid", limited: true })
  if (result.kind !== "invalid") throw new Error("Expected errors")
  expect(result.issues).toHaveLength(50)
  expect(result.issues.at(-1)?.path).toBe("$.features[49]")
})

test("checks bbox dimensions against contained positions and rejects misplaced geometries", () => {
  expect(
    validateGeoJson(
      '{"type":"Point","coordinates":[10,20,30],"bbox":[0,0,20,30],"geometries":[]}'
    )
  ).toMatchObject({
    kind: "invalid",
    issues: [
      { path: "$.geometries", code: "member" },
      { path: "$.bbox", code: "bbox" },
    ],
  })
  expect(
    validateGeoJson(
      '{"type":"Point","coordinates":[10,20,30],"bbox":[0,0,0,20,30,40]}'
    )
  ).toMatchObject({ kind: "valid" })
  expect(
    validateGeoJson(
      '{"type":"Feature","geometry":{"type":"Point","coordinates":[10,20,30]},"properties":null,"bbox":[0,0,20,30]}'
    )
  ).toMatchObject({
    kind: "invalid",
    issues: [{ path: "$.bbox", code: "bbox" }],
  })
})

test("does not treat text echoed by a syntax error as a location", () => {
  expect(validateGeoJson("line 100 column 2")).toEqual({ kind: "syntax" })
})
