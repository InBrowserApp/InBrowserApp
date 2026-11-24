import { writeFile } from "node:fs/promises"

import { kubernetesVersion } from "../schema-version.ts"

const source = `https://raw.githubusercontent.com/kubernetes/kubernetes/v${kubernetesVersion}/api/openapi-spec/swagger.json`
const response = await fetch(source)
if (!response.ok)
  throw new Error(`Kubernetes OpenAPI download failed (${response.status})`)
const { definitions: openApiDefinitions } = await response.json()
const definitions = {}
const resources = {}

function optional(schema) {
  if (schema.$ref) return { anyOf: [schema, { type: "null" }] }
  if (schema.type) return { ...schema, type: [...[schema.type].flat(), "null"] }
  return schema
}

function schemaFor(source) {
  if (source.format === "int-or-string") return { type: ["integer", "string"] }

  const schema = {}
  for (const key of ["type", "required", "$ref"]) {
    if (key in source) schema[key] = source[key]
  }
  if (source.items) schema.items = schemaFor(source.items)
  if (source.properties) {
    schema.properties = Object.fromEntries(
      Object.entries(source.properties).map(([key, value]) => {
        const property = schemaFor(value)
        return [
          key,
          source.required?.includes(key) ? property : optional(property),
        ]
      })
    )
    schema.additionalProperties = false
  }
  if ("additionalProperties" in source) {
    schema.additionalProperties =
      typeof source.additionalProperties === "boolean"
        ? source.additionalProperties
        : schemaFor(source.additionalProperties)
  }
  return schema
}

for (const [key, schema] of Object.entries(openApiDefinitions)) {
  definitions[key] = schemaFor(schema)
  for (const { group, version, kind } of schema[
    "x-kubernetes-group-version-kind"
  ] ?? []) {
    resources[[group, version, kind].filter(Boolean).join("/")] = key
  }
}

definitions["io.k8s.apimachinery.pkg.api.resource.Quantity"].type = [
  "number",
  "string",
]

await writeFile(
  new URL("./built-in-schemas.json", import.meta.url),
  JSON.stringify({ resources, definitions }, null, 2) + "\n"
)
