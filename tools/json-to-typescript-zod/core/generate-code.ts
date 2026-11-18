type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

type Primitive = "null" | "boolean" | "number" | "string" | "unknown"

type Shape =
  | { kind: Primitive }
  | { kind: "array"; item: Shape }
  | { kind: "object"; properties: Property[] }
  | { kind: "union"; variants: Shape[] }

type Property = { name: string; shape: Shape; optional: boolean }

type Result =
  | { status: "empty" | "invalid" }
  | { status: "ok"; typescript: string; zod: string }

function infer(samples: JsonValue[]): Shape {
  const primitives = new Set<Primitive>()
  const arrays: JsonValue[][] = []
  const objects: { [key: string]: JsonValue }[] = []

  for (const value of samples) {
    if (value === null) {
      primitives.add("null")
    } else if (Array.isArray(value)) {
      arrays.push(value)
    } else if (typeof value === "object") {
      objects.push(value)
    } else {
      primitives.add(typeof value as "boolean" | "number" | "string")
    }
  }

  const variants: Shape[] = Array.from(primitives, (kind) => ({ kind }))
  if (arrays.length > 0) {
    variants.push({ kind: "array", item: infer(arrays.flat()) })
  }
  if (objects.length > 0) {
    variants.push(inferObject(objects))
  }
  if (variants.length === 0) return { kind: "unknown" }
  if (variants.length === 1) return variants[0]!
  return { kind: "union", variants }
}

function inferObject(samples: { [key: string]: JsonValue }[]): Shape {
  const fields = new Map<string, JsonValue[]>()
  for (const record of samples) {
    for (const [name, value] of Object.entries(record)) {
      const values = fields.get(name)
      if (values) {
        values.push(value)
      } else {
        fields.set(name, [value])
      }
    }
  }
  return {
    kind: "object",
    properties: Array.from(fields, ([name, values]) => ({
      name,
      shape: infer(values),
      optional: values.length < samples.length,
    })),
  }
}

function propertyKey(name: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name)
}

function typescript(shape: Shape, indent = ""): string {
  switch (shape.kind) {
    case "array":
      return `Array<${typescript(shape.item, indent)}>`
    case "union":
      return shape.variants
        .map((variant) => typescript(variant, indent))
        .join(" | ")
    case "object": {
      if (shape.properties.length === 0) return "Record<string, unknown>"
      const nested = indent + "  "
      const fields = shape.properties.map(
        ({ name, shape: field, optional }) =>
          `${nested}${propertyKey(name)}${optional ? "?" : ""}: ${typescript(field, nested)}`
      )
      return `{\n${fields.join("\n")}\n${indent}}`
    }
    default:
      return shape.kind
  }
}

function zod(shape: Shape, indent = ""): string {
  switch (shape.kind) {
    case "array":
      return `z.array(${zod(shape.item, indent)})`
    case "union":
      return `z.union([${shape.variants.map((variant) => zod(variant, indent)).join(", ")}])`
    case "object": {
      if (shape.properties.length === 0) return "z.object({})"
      const nested = indent + "  "
      const fields = shape.properties.map(
        ({ name, shape: field, optional }) => {
          const key = name === "__proto__" ? '["__proto__"]' : propertyKey(name)
          return `${nested}${key}: ${zod(field, nested)}${optional ? ".optional()" : ""},`
        }
      )
      return `z.object({\n${fields.join("\n")}\n${indent}})`
    }
    default:
      return `z.${shape.kind}()`
  }
}

export function generateCode(input: string): Result {
  if (!input.trim()) return { status: "empty" }

  let sample: JsonValue
  try {
    sample = JSON.parse(input) as JsonValue
  } catch {
    return { status: "invalid" }
  }

  const shape = infer([sample])
  return {
    status: "ok",
    typescript: `export type ApiResponse = ${typescript(shape)}\n`,
    zod: `import { z } from "zod"\n\nexport const apiResponseSchema = ${zod(shape)}\n\nexport type ApiResponse = z.infer<typeof apiResponseSchema>\n`,
  }
}
