type Code =
  | "object"
  | "type"
  | "array"
  | "properties"
  | "id"
  | "position"
  | "longitude"
  | "latitude"
  | "line"
  | "ring"
  | "closedRing"
  | "bbox"
  | "member"
  | "deep"

type Issue = { path: string; code: Code }
export type Validation =
  | { kind: "valid"; type: string; features?: number }
  | { kind: "invalid"; issues: Issue[]; limited: boolean }
  | { kind: "syntax"; line?: number; column?: number }

const maxIssues = 50
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function numbers(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(Number.isFinite)
}

function validBounds(value: unknown, dimensions: number) {
  if (!numbers(value) || value.length < 4 || value.length % 2 !== 0)
    return false
  const middle = value.length / 2
  if (dimensions && middle !== dimensions) return false
  if (
    Math.abs(value[0]!) > 180 ||
    Math.abs(value[middle]!) > 180 ||
    Math.abs(value[1]!) > 90 ||
    Math.abs(value[middle + 1]!) > 90
  )
    return false
  // A longitude interval may cross the antimeridian.
  return value
    .slice(1, middle)
    .every((minimum, index) => minimum <= value[middle + index + 1]!)
}

function syntaxResult(input: string, error: unknown): Validation {
  const description = error instanceof Error ? error.message : ""
  const lineColumn =
    /(?:\(|\bat )line (\d+) column (\d+)(?:\)| of the JSON data)?$/i.exec(
      description
    )
  if (lineColumn)
    return {
      kind: "syntax",
      line: Number(lineColumn[1]),
      column: Number(lineColumn[2]),
    }
  const position = /\bat position (\d+)$/i.exec(description)
  const offset = position
    ? Number(position[1])
    : /^unexpected end of JSON input$/i.test(description)
      ? input.length
      : undefined
  if (offset === undefined) return { kind: "syntax" }
  const lines = input.slice(0, offset).split(/\r\n|\r|\n/)
  return {
    kind: "syntax",
    line: lines.length,
    column: lines.at(-1)!.length + 1,
  }
}

export function validateGeoJson(text: string): Validation {
  const input = text.replace(/^\uFEFF/, "")
  let value: unknown
  try {
    value = JSON.parse(input)
  } catch (error) {
    return syntaxResult(input, error)
  }

  const issues: Issue[] = []
  let limited = false
  function report(path: string, code: Code) {
    if (issues.length < maxIssues) issues.push({ path, code })
    else limited = true
  }

  type Check = (item: unknown, path: string) => number

  function each(items: unknown, path: string, check: Check) {
    if (!Array.isArray(items)) {
      report(path, "array")
      return 0
    }
    let dimensions = 0
    for (let index = 0; index < items.length && !limited; index++) {
      dimensions = Math.max(
        dimensions,
        check(items[index], `${path}[${index}]`)
      )
    }
    return dimensions
  }

  function checkBounds(
    record: Record<string, unknown>,
    path: string,
    dimensions: number
  ) {
    if ("bbox" in record && !validBounds(record.bbox, dimensions))
      report(`${path}.bbox`, "bbox")
  }

  function reserved(
    record: Record<string, unknown>,
    path: string,
    keys: readonly string[]
  ) {
    for (const key of keys)
      if (key in record) report(`${path}.${key}`, "member")
  }

  function position(item: unknown, path: string) {
    if (!numbers(item) || item.length < 2) {
      report(path, "position")
      return 0
    }
    if (Math.abs(item[0]!) > 180) report(`${path}[0]`, "longitude")
    if (Math.abs(item[1]!) > 90) report(`${path}[1]`, "latitude")
    return item.length
  }

  function line(item: unknown, path: string) {
    if (Array.isArray(item) && item.length < 2) {
      report(path, "line")
      return 0
    }
    return each(item, path, position)
  }

  function ring(item: unknown, path: string) {
    if (!Array.isArray(item)) {
      report(path, "array")
      return 0
    }
    if (item.length < 4) {
      report(path, "ring")
      return 0
    }
    const dimensions = each(item, path, position)
    const first = item[0]
    const last = item.at(-1)
    if (
      numbers(first) &&
      numbers(last) &&
      (first.length !== last.length ||
        first.some((value, index) => value !== last[index]))
    )
      report(path, "closedRing")
    return dimensions
  }

  const polygon: Check = (item, path) => each(item, path, ring)
  const checkers: Readonly<Record<string, Check>> = {
    Point: position,
    MultiPoint: (item, path) => each(item, path, position),
    LineString: line,
    MultiLineString: (item, path) => each(item, path, line),
    Polygon: polygon,
    MultiPolygon: (item, path) => each(item, path, polygon),
  }

  function geometry(item: unknown, path: string): number {
    if (!object(item)) {
      report(path, "object")
      return 0
    }
    const type = item.type
    if (
      typeof type !== "string" ||
      (type !== "GeometryCollection" && !Object.hasOwn(checkers, type))
    ) {
      report(`${path}.type`, "type")
      return 0
    }
    reserved(item, path, ["features", "geometry", "properties"])
    let dimensions = 0
    if (type === "GeometryCollection") {
      reserved(item, path, ["coordinates"])
      dimensions = each(item.geometries, `${path}.geometries`, geometry)
    } else {
      reserved(item, path, ["geometries"])
      const { coordinates } = item
      const field = `${path}.coordinates`
      if (!Array.isArray(coordinates)) report(field, "array")
      else if (coordinates.length > 0)
        dimensions = checkers[type]!(coordinates, field)
    }
    checkBounds(item, path, dimensions)
    return dimensions
  }

  function feature(item: unknown, path: string) {
    if (!object(item)) {
      report(path, "object")
      return 0
    }
    if (item.type !== "Feature") {
      report(`${path}.type`, "type")
      return 0
    }
    reserved(item, path, ["features", "coordinates", "geometries"])
    if (item.properties !== null && !object(item.properties))
      report(`${path}.properties`, "properties")
    if (
      "id" in item &&
      typeof item.id !== "string" &&
      !Number.isFinite(item.id)
    )
      report(`${path}.id`, "id")
    const dimensions =
      item.geometry === null ? 0 : geometry(item.geometry, `${path}.geometry`)
    checkBounds(item, path, dimensions)
    return dimensions
  }

  try {
    if (object(value) && value.type === "FeatureCollection") {
      reserved(value, "$", [
        "coordinates",
        "geometries",
        "geometry",
        "properties",
      ])
      const dimensions = each(value.features, "$.features", feature)
      checkBounds(value, "$", dimensions)
    } else if (object(value) && value.type === "Feature") feature(value, "$")
    else geometry(value, "$")
  } catch (error) {
    if (!(error instanceof RangeError)) throw error
    report("$", "deep")
  }

  if (issues.length > 0) return { kind: "invalid", issues, limited }
  const record = value as Record<string, unknown>
  return {
    kind: "valid",
    type: String(record.type),
    features:
      record.type === "FeatureCollection" && Array.isArray(record.features)
        ? record.features.length
        : record.type === "Feature"
          ? 1
          : undefined,
  }
}
