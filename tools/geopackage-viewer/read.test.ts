import { readFileSync } from "node:fs"
import initSqlJs from "sql.js"
import { expect, test } from "vitest"
import { decodeGeometry, entriesOf, previewLayer } from "./read"

const SQL = await initSqlJs()

test("lists and maps the bundled GeoPackage's points and projected polygons", () => {
  const db = new SQL.Database(
    readFileSync("tools/geopackage-viewer/bay-example.gpkg")
  )
  try {
    const [notes, piers, areas] = entriesOf(db)
    expect(notes).toMatchObject({ name: "field_notes", type: "attributes" })
    expect(piers).toMatchObject({
      name: "piers",
      type: "features",
      projections: expect.arrayContaining(["EPSG:4326"]),
    })
    expect(previewLayer(db, piers!)).toMatchObject({
      hasGeometry: true,
      truncated: false,
      features: [
        {
          geometry: { type: "Point", coordinates: [-122.487, 37.853] },
          properties: { name: "North Pier" },
        },
        {},
        {},
      ],
    })
    const layer = previewLayer(db, areas!)
    const polygon = layer.features[0]?.geometry
    expect(layer.hasGeometry).toBe(true)
    expect(polygon?.type).toBe("Polygon")
    if (polygon?.type !== "Polygon")
      throw new Error("Expected projected polygon")
    expect(polygon.coordinates[0]?.[0]?.[0]).toBeCloseTo(-122.489, 4)
    expect(polygon.coordinates[0]?.[0]?.[1]).toBeCloseTo(37.79, 4)
    db.run(`ALTER TABLE gpkg_spatial_ref_sys ADD COLUMN definition_12_063 TEXT;
      UPDATE gpkg_spatial_ref_sys SET definition_12_063 = definition, definition = 'undefined' WHERE srs_id = 32610;`)
    expect(previewLayer(db, entriesOf(db)[2]!).hasGeometry).toBe(true)
    expect(previewLayer(db, notes!).features).toMatchObject([
      {
        geometry: null,
        properties: { name: "Bay survey" },
      },
    ])
  } finally {
    db.close()
  }
})

test("quotes table names, reports truncated rows and keeps binary attributes bounded", () => {
  const db = new SQL.Database()
  try {
    db.run(`CREATE TABLE "survey ""daily""" (id INTEGER, attachment BLOB);
      WITH RECURSIVE ids(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM ids WHERE n < 502)
      INSERT INTO "survey ""daily""" SELECT CASE n WHEN 1 THEN 9007199254740993 ELSE n END, X'CAFE' FROM ids;`)
    const layer = previewLayer(db, {
      name: 'survey "daily"',
      title: "Daily survey",
      type: "attributes",
    })
    expect(layer.features).toHaveLength(500)
    expect(layer.truncated).toBe(true)
    expect(layer.features[0]?.properties).toEqual({
      id: "9007199254740993",
      attachment: { binary: 2 },
    })
  } finally {
    db.close()
  }
})

test("accepts an empty attributes-only package catalog and rejects invalid geometry blobs", () => {
  const db = new SQL.Database()
  try {
    db.run("CREATE TABLE gpkg_contents (table_name, identifier, data_type)")
    expect(entriesOf(db)).toEqual([])
    db.run(
      "INSERT INTO gpkg_contents VALUES ('raster', 'Terrain', 'tiles'), ('private', NULL, 'extension')"
    )
    expect(entriesOf(db)).toEqual([
      { name: "private", title: "private", type: "other" },
      { name: "raster", title: "Terrain", type: "tiles" },
    ])
    expect(decodeGeometry(new Uint8Array([0, 1, 0, 0, 0, 0, 0, 0]))).toBeNull()
    expect(
      decodeGeometry(new Uint8Array([0x47, 0x50, 0, 16, 0, 0, 0, 0]))
    ).toBeNull()
  } finally {
    db.close()
  }
})
