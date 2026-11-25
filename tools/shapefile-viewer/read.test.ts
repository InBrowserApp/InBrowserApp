import { readFileSync } from "node:fs"
import { unzipSync } from "fflate"
import { expect, test } from "vitest"
import { readShapefiles } from "./read"

function archive(name: string) {
  return new Uint8Array(readFileSync(`tools/shapefile-viewer/${name}`))
}

test("reads a ZIP with distinct point and polygon layers and their attributes", () => {
  const [piers, areas] = readShapefiles([
    { name: "BAY.ZIP", bytes: archive("bay-example.zip").buffer },
  ])
  expect(piers).toMatchObject({
    name: "piers",
    placement: "exact",
    features: [{ properties: { name: "North Pier", area: "Marin" } }, {}, {}],
  })
  expect(areas).toMatchObject({
    name: "survey-areas",
    placement: "exact",
    features: [{ geometry: { type: "Polygon" } }, {}],
  })
})

test("reprojects selected companion files and keeps unplaced records available", () => {
  const files = Object.entries(
    unzipSync(archive("fixtures/projected.zip"))
  ).map(([name, bytes]) => ({
    name: name.toUpperCase(),
    bytes: Uint8Array.from(bytes).buffer,
  }))
  const [layer] = readShapefiles(files)
  const point = layer?.features[0]?.geometry
  expect(layer?.placement).toBe("exact")
  expect(point?.type).toBe("Point")
  if (point?.type !== "Point") throw new Error("Expected a reprojected point")
  expect(point.coordinates[0]).toBeCloseTo(-122.487, 5)
  expect(point.coordinates[1]).toBeCloseTo(37.853, 5)
  const [missingProjection] = readShapefiles(
    files.filter(({ name }) => !name.endsWith(".PRJ"))
  )
  expect(missingProjection?.placement).toBe("unmapped")
  expect(missingProjection?.features[0]?.properties?.name).toBe("North Pier")
  const prj = files.find(({ name }) => name.endsWith(".PRJ"))!
  prj.bytes = new TextEncoder().encode("broken WKT").buffer
  expect(readShapefiles(files)[0]?.placement).toBe("unmapped")
})

test("opens a standalone geographic SHP and reports an absent geometry file", () => {
  const files = unzipSync(archive("bay-example.zip"))
  const shape = {
    name: "piers.shp",
    bytes: Uint8Array.from(files["piers.shp"]!).buffer,
  }
  const [layer] = readShapefiles([shape])
  expect(layer?.placement).toBe("assumed")
  expect(layer?.features[0]?.properties).toBeNull()
  expect(() =>
    readShapefiles([{ name: "piers.dbf", bytes: shape.bytes }])
  ).toThrow("No Shapefile")
  expect(() =>
    readShapefiles([{ name: "broken.shp", bytes: new ArrayBuffer(4) }])
  ).toThrow("Invalid Shapefile")
})

test("matches exact basenames even when an archive has case-distinct layers", () => {
  const [upper, lower] = readShapefiles([
    {
      name: "case-collision.zip",
      bytes: archive("fixtures/case-collision.zip").buffer,
    },
  ])
  expect(upper).toMatchObject({
    name: "Sites",
    features: [{ properties: { id: 1 } }],
  })
  expect(lower).toMatchObject({
    name: "sites",
    features: [{ properties: { id: 2 } }],
  })
})

test("keeps DBF calendar dates and default Western text, skipping deleted slots", () => {
  const [deleted, legacy] = readShapefiles([
    {
      name: "dbf-records.zip",
      bytes: archive("fixtures/dbf-records.zip").buffer,
    },
  ])
  expect(deleted).toMatchObject({
    features: [{ properties: { name: "Bern", id: 2, survey_dat: null } }],
  })
  expect(legacy).toMatchObject({
    features: [{ properties: { name: "Région", survey_dat: "2020-01-02" } }],
  })
})

test("rejects a truncated DBF before reading its claimed records", () => {
  const files = unzipSync(archive("bay-example.zip"))
  const bytes = files["piers.dbf"]!.buffer
  new DataView(bytes).setUint32(4, 0xffffffff, true)
  expect(() =>
    readShapefiles([
      { name: "piers.shp", bytes: files["piers.shp"]!.buffer },
      { name: "piers.dbf", bytes },
    ])
  ).toThrow("Invalid DBF record span")
})

test("leaves attributes empty when only a case-distinct layer has a DBF", () => {
  const files = Object.entries(
    unzipSync(archive("fixtures/case-collision.zip"))
  )
    .filter(([name]) => name !== "Sites.dbf")
    .map(([name, bytes]) => ({ name, bytes: bytes.buffer }))
  const [upper, lower] = readShapefiles(files)
  expect(upper?.features[0]?.properties).toBeNull()
  expect(lower?.features[0]?.properties?.id).toBe(2)
})
