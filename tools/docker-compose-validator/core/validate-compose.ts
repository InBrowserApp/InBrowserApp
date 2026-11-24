import Ajv2020 from "ajv/dist/2020.js"
import type { ErrorObject } from "ajv"
import {
  LineCounter,
  isMap,
  isNode,
  parse,
  parseAllDocuments,
  visit,
  type ParsedNode,
} from "yaml"
import schema from "../vendor/compose-spec.json"

type ComposeIssue = (
  | { message: string; code?: never }
  | {
      code: "unknownField" | "singleDocument" | "emptyDocument"
      message?: never
    }
) & {
  path?: string
  location: { offset: number; line: number; column: number }
}

const checkSchema = new Ajv2020({
  allErrors: true,
  strict: false,
  ownProperties: true,
}).compile(schema)

function getErrorPath(error: ErrorObject) {
  const parent = error.instancePath
    .split("/")
    .slice(1)
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"))
  const { missingProperty, additionalProperty, unevaluatedProperty } =
    error.params
  const property: string | undefined =
    missingProperty ?? additionalProperty ?? unevaluatedProperty
  return property === undefined ? parent : [...parent, property]
}

function isPrefix(parent: string[], path: string[]) {
  return (
    parent.length <= path.length &&
    parent.every((part, index) => part === path[index])
  )
}

function getSchemaIssues(errors: ErrorObject[]) {
  const details = errors.map((error) => ({ error, path: getErrorPath(error) }))
  const unique = new Map<string, (typeof details)[number]>()
  for (const item of details) {
    const { error, path } = item
    const fallback = [
      "unevaluatedProperties",
      "anyOf",
      "oneOf",
      "type",
    ].includes(error.keyword)
    if (
      fallback &&
      details.some(
        (other) =>
          other !== item &&
          isPrefix(path, other.path) &&
          (other.path.length > path.length ||
            (error.keyword !== "type" &&
              !["unevaluatedProperties", "anyOf", "oneOf"].includes(
                other.error.keyword
              )))
      )
    )
      continue
    unique.set(JSON.stringify([path, error.keyword, error.message]), item)
  }
  return [...unique.values()]
}

function validateCompose(source: string): ComposeIssue[] {
  const lines = new LineCounter()
  const docs = parseAllDocuments(source, {
    lineCounter: lines,
    merge: true,
    prettyErrors: false,
  })

  function location(offset: number) {
    const { line, col } = lines.linePos(offset)
    return { offset, line, column: col }
  }

  const syntaxIssues = docs.flatMap((doc) =>
    [
      ...doc.errors,
      ...doc.warnings.filter(
        (warning) =>
          warning.code === "TAG_RESOLVE_FAILED" &&
          !/!(?:reset|override)$/.test(warning.message)
      ),
    ].map((error) => ({
      message: error.message,
      location: location(error.pos[0]),
    }))
  )
  if (syntaxIssues.length) return syntaxIssues
  if (docs.length > 1) {
    return [
      {
        code: "singleDocument",
        location: location(docs[1]!.range[0]),
      },
    ]
  }
  const doc = docs[0]
  if (!doc?.contents) {
    return [{ code: "emptyDocument", location: location(0) }]
  }

  // A reset value is discarded when Compose merges files.
  visit(doc, {
    Pair(_, pair) {
      if (isNode(pair.value) && pair.value.tag === "!reset") {
        return visit.REMOVE
      }
      return undefined
    },
    Scalar(_, node) {
      if (
        node.tag === "!override" &&
        node.type === "PLAIN" &&
        typeof node.source === "string"
      ) {
        node.value = parse(node.source)
      }
    },
  })

  try {
    if (checkSchema(doc.toJS())) return []
  } catch (error) {
    return [
      {
        message: (error as Error).message,
        location: location(doc.range[0]),
      },
    ]
  }

  return getSchemaIssues(checkSchema.errors!).map(({ error, path }) => {
    let offset = doc.range[0]
    for (let depth = path.length; depth > 0; depth--) {
      const parent = doc.getIn(path.slice(0, depth - 1), true)
      const key = path[depth - 1]
      const node = (
        isMap(parent)
          ? parent.items.find((pair) => String(pair.key) === key)?.key
          : doc.getIn(path.slice(0, depth), true)
      ) as ParsedNode | undefined
      if (node) {
        offset = node.range[0]
        break
      }
    }
    const issue = { path: path.join("."), location: location(offset) }
    if (
      error.keyword === "additionalProperties" ||
      error.keyword === "unevaluatedProperties"
    ) {
      return { ...issue, code: "unknownField" }
    }
    return { ...issue, message: error.message! }
  })
}

export { validateCompose }
