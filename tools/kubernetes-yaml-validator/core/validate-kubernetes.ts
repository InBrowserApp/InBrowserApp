import Ajv, { type ValidateFunction } from "ajv"
import {
  LineCounter,
  isMap,
  parseAllDocuments,
  type Document,
  type ParsedNode,
} from "yaml"

import bundle from "../vendor/built-in-schemas.json"

type DiagnosticCode =
  | "emptyDocument"
  | "expectedResource"
  | "missingIdentity"
  | "unknownSchema"
  | "unknownField"

type Diagnostic = (
  | { code: DiagnosticCode; message?: never }
  | { message: string; code?: never }
) & {
  path?: string
  location: { offset: number; line: number; column: number }
}

const schemaId = "https://inbrowser.app/schemas/kubernetes-built-ins"
const schemaKeys = new Map(Object.entries(bundle.resources))
const validators = new Map<string, ValidateFunction>()
const ajv = new Ajv({ allErrors: true, strict: false, ownProperties: true })
ajv.addSchema({
  $id: schemaId,
  definitions: {
    ...bundle.definitions,
    List: {
      type: "object",
      properties: {
        apiVersion: { type: "string" },
        kind: { type: "string" },
        metadata: {
          anyOf: [
            {
              $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
            },
            { type: "null" },
          ],
        },
        items: { type: "array" },
      },
      required: ["items"],
      additionalProperties: false,
    },
  },
})
schemaKeys.set("v1/List", "List")

function schemaValidator(key: string) {
  let validator = validators.get(key)
  if (!validator) {
    validator = ajv.compile({ $ref: `${schemaId}#/definitions/${key}` })
    validators.set(key, validator)
  }
  return validator
}

function isMapping(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function locatePath(doc: Document.Parsed, path: string[]) {
  for (let depth = path.length; depth > 0; depth--) {
    const parent = doc.getIn(path.slice(0, depth - 1), true)
    const key = path[depth - 1]
    // A map key makes a more useful jump target than the start of a nested value.
    const node = (
      isMap(parent)
        ? parent.items.find((pair) => String(pair.key) === key)?.key
        : doc.getIn(path.slice(0, depth), true)
    ) as ParsedNode | undefined
    if (node) return node.range[0]
  }
  return doc.range[0]
}

function validateKubernetes(source: string): Diagnostic[] {
  const lines = new LineCounter()
  const documents = parseAllDocuments(source, {
    lineCounter: lines,
    prettyErrors: false,
    merge: true,
    version: "1.1",
    customTags: (tags) =>
      tags.filter(
        (tag) => (tag as { tag: string }).tag !== "tag:yaml.org,2002:timestamp"
      ),
  })
  const issues: Diagnostic[] = []
  let sawResource = false

  function location(offset: number) {
    const { line, col } = lines.linePos(offset)
    return { offset, line, column: col }
  }

  for (const doc of documents) {
    const activeLists = new Set()
    const report = (
      detail: { code: DiagnosticCode } | { message: string },
      path: string[]
    ) =>
      issues.push({
        ...detail,
        path: path.join("."),
        location: location(locatePath(doc, path)),
      })

    function checkResource(data: unknown, path: string[]) {
      if (!isMapping(data)) {
        report({ code: "expectedResource" }, path)
        return
      }

      const identities = ["apiVersion", "kind"] as const
      const missing = identities.filter(
        (field) => typeof data[field] !== "string" || !data[field].trim()
      )
      if (missing.length) {
        for (const field of missing)
          report({ code: "missingIdentity" }, [...path, field])
        return
      }
      const { apiVersion, kind } = data

      const key = schemaKeys.get(`${apiVersion}/${kind}`)
      if (!key) {
        report({ code: "unknownSchema" }, [...path, "kind"])
        return
      }

      const check = schemaValidator(key)
      check(data)

      for (const error of check.errors ?? []) {
        // The synthetic null alternatives model optional Kubernetes fields.
        if (
          error.keyword === "anyOf" ||
          (error.keyword === "type" && error.params.type === "null")
        )
          continue
        const keys = error.instancePath
          .split("/")
          .slice(1)
          .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"))
        const field: string | undefined =
          error.params.additionalProperty ?? error.params.missingProperty
        const target = [...path, ...keys]
        if (field !== undefined) target.push(field)
        report(
          error.keyword === "additionalProperties"
            ? { code: "unknownField" }
            : { message: error.message! },
          target
        )
      }
      if (key === "List" && Array.isArray(data.items)) {
        if (activeLists.has(data)) {
          report({ message: "Circular YAML alias in the resource list" }, path)
          return
        }
        activeLists.add(data)
        data.items.forEach((item, index) =>
          checkResource(item, [...path, "items", String(index)])
        )
        activeLists.delete(data)
      }
    }

    const errors = [
      ...doc.errors,
      ...doc.warnings.filter(
        (warning) => warning.code === "TAG_RESOLVE_FAILED"
      ),
    ]
    if (errors.length) {
      for (const error of errors)
        issues.push({
          message: error.message,
          location: location(error.pos[0]),
        })
      continue
    }

    try {
      const data: unknown = doc.toJS()
      // Separators and comments alone do not create resources.
      if (data === null && doc.contents?.range[0] === doc.contents?.range[1])
        continue
      sawResource = true
      checkResource(data, [])
    } catch (error) {
      report({ message: (error as Error).message }, [])
    }
  }

  if (!sawResource && issues.length === 0) {
    issues.push({ code: "emptyDocument", location: location(0) })
  }
  return issues
}

export { validateKubernetes }
