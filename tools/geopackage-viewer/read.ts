import proj4 from "proj4"
import { wkbToGeoJSON } from "@uwdata/wk-geojson"
import { geoJsonValue, positionsOf } from "@workspace/geospatial/geojson"
import type { Feature, Geometry, Position } from "geojson"
import type { Database, SqlValue } from "sql.js"

const previewLimit = 500
export type Entry = {
  name: string
  title: string
  type: "features" | "attributes" | "tiles" | "other"
  geometryColumn?: string
  projections?: string[]
}
export type LayerPreview = {
  features: Feature<Geometry | null>[]
  hasGeometry: boolean
  truncated: boolean
}
const envelopeBytes = [0, 32, 48, 48, 64]

export function entriesOf(database: Database): Entry[] {
  const contents =
    database.exec(
      "SELECT table_name, identifier, data_type FROM gpkg_contents ORDER BY table_name"
    )[0]?.values ?? []
  const hasModernCrs =
    database.exec(
      "SELECT 1 FROM pragma_table_info('gpkg_spatial_ref_sys') WHERE name = 'definition_12_063'"
    ).length > 0
  const modernColumn = hasModernCrs ? ", s.definition_12_063" : ""
  const columns = contents.some((row) => row[2] === "features")
    ? (database.exec(
        `SELECT g.table_name, g.column_name, s.organization, s.organization_coordsys_id, s.definition${modernColumn}
         FROM gpkg_geometry_columns g
         LEFT JOIN gpkg_spatial_ref_sys s ON g.srs_id = s.srs_id`
      )[0]?.values ?? [])
    : []
  const byName = new Map(columns.map((row) => [row[0], row]))
  return contents.map(([table, identifier, dataType]) => {
    const name = String(table)
    const title =
      typeof identifier === "string" && identifier ? identifier : name
    if (dataType === "features") {
      const [, column, authority, code, definition, modern] =
        byName.get(name) ?? []
      const builtin = authority === "EPSG" && (code === 4326 || code === 3857)
      return {
        name,
        title,
        type: "features",
        geometryColumn: typeof column === "string" ? column : undefined,
        projections: [
          builtin ? `EPSG:${code}` : undefined,
          modern,
          definition,
        ].filter(
          (value): value is string =>
            typeof value === "string" &&
            value !== "undefined" &&
            Boolean(value.trim())
        ),
      }
    }
    if (dataType === "attributes") return { name, title, type: "attributes" }
    if (dataType === "tiles" || dataType === "2d-gridded-coverage")
      return { name, title, type: "tiles" }
    return { name, title, type: "other" }
  })
}

type Project = (position: Position) => Position
type Coordinates = Position | Position[] | Position[][] | Position[][][]

function projectCoordinates(
  value: Coordinates,
  transform: Project
): Coordinates {
  if (typeof value[0] === "number") {
    return transform(value as Position)
  }
  return (value as Coordinates[]).map((part) =>
    projectCoordinates(part, transform)
  ) as Coordinates
}

function projectGeometry(geometry: Geometry, transform: Project): Geometry {
  return geometry.type === "GeometryCollection"
    ? {
        ...geometry,
        geometries: geometry.geometries.map((part) =>
          projectGeometry(part, transform)
        ),
      }
    : ({
        ...geometry,
        coordinates: projectCoordinates(geometry.coordinates, transform),
      } as Geometry)
}

export function decodeGeometry(bytes: Uint8Array): Geometry | null {
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x47 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0
  )
    return null
  const flags = bytes[3]!
  const envelope = envelopeBytes[(flags >> 1) & 7]
  if (flags & 0x30 || envelope === undefined || 8 + envelope >= bytes.length)
    return null
  try {
    const geometry = geoJsonValue(wkbToGeoJSON(bytes.subarray(8 + envelope)))
    return geometry.type === "Feature" || geometry.type === "FeatureCollection"
      ? null
      : geometry
  } catch {
    return null
  }
}

type ExactDatabase = Database & {
  exec(
    sql: string,
    params: undefined,
    config: { useBigInt: true }
  ): {
    columns: string[]
    values: (SqlValue | bigint)[][]
  }[]
}

function projector(projections: readonly string[]): Project | undefined {
  for (const definition of projections) {
    if (definition === "EPSG:4326") return (position) => position
    try {
      const projection = proj4(definition, "EPSG:4326")
      return (position) => projection.forward(position)
    } catch {
      // Try the other CRS definitions before falling back to attributes.
    }
  }
  return undefined
}

function attributeValue(value: SqlValue | bigint | undefined) {
  if (value instanceof Uint8Array) return { binary: value.length }
  if (typeof value !== "bigint") return value
  const number = Number(value)
  return Number.isSafeInteger(number) ? number : value.toString()
}

export function previewLayer(database: Database, entry: Entry): LayerPreview {
  const table = '"' + entry.name.replaceAll('"', '""') + '"'
  const [data] = (database as ExactDatabase).exec(
    `SELECT * FROM ${table} LIMIT ${previewLimit + 1}`,
    undefined,
    { useBigInt: true }
  )
  if (!data) return { features: [], hasGeometry: false, truncated: false }
  const project = projector(entry.projections ?? [])
  let hasGeometry = false
  const columnIndex = entry.geometryColumn
    ? data.columns.indexOf(entry.geometryColumn)
    : undefined
  const attributeColumns = data.columns
    .map((name, index) => ({ name, index }))
    .filter(({ index }) => index !== columnIndex)
  const features = data.values
    .slice(0, previewLimit)
    .map((row): Feature<Geometry | null> => {
      let geometry: Geometry | null = null
      const blob = columnIndex === undefined ? undefined : row[columnIndex]
      if (blob instanceof Uint8Array && project) {
        const decoded = decodeGeometry(blob)
        if (decoded) {
          const mapped = projectGeometry(decoded, project)
          const positions = positionsOf(mapped)
          if (
            positions.length &&
            positions.every(
              ([lon, lat]) =>
                Number.isFinite(lon) &&
                Number.isFinite(lat) &&
                Math.abs(lon!) <= 180 &&
                Math.abs(lat!) <= 90
            )
          ) {
            geometry = mapped
            hasGeometry = true
          }
        }
      }
      const properties = Object.fromEntries(
        attributeColumns.map(({ name, index }) => [
          name,
          attributeValue(row[index]),
        ])
      )
      return { type: "Feature", geometry, properties }
    })
  return {
    features,
    hasGeometry,
    truncated: data.values.length > previewLimit,
  }
}
