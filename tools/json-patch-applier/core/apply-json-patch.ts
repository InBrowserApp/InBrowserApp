import { LosslessNumber, parse, stringify } from "lossless-json"
import { findDuplicateOperationFields } from "./duplicate-operation-fields"

type JsonValue =
  | null
  | boolean
  | string
  | LosslessNumber
  | JsonValue[]
  | JsonObject
type JsonObject = { [key: string]: JsonValue }
type JsonDocument = JsonValue | undefined

type OperationError =
  | "invalidOperation"
  | "duplicateOperationField"
  | "invalidPath"
  | "invalidFrom"
  | "missingValue"
  | "missingPath"
  | "missingFrom"
  | "invalidMove"
  | "testFailed"

type Edit = { op: "add" | "replace"; value: JsonValue } | { op: "remove" }

type InputError = "invalidOriginal" | "invalidPatch"
type ApplicationError = {
  kind: "error"
  reason: InputError | "patchNotArray" | "documentTooComplex"
}

type Result =
  | { kind: "success"; text: string | undefined }
  | ApplicationError
  | {
      kind: "operationError"
      reason: OperationError
      number: number
      op?: string
      path?: string
      from?: string
    }

class PatchError extends Error {
  constructor(readonly reason: OperationError) {
    super(reason)
  }
}

function isObject(value: JsonDocument): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof LosslessNumber)
  )
}

function pointer(value: JsonDocument, reason: "invalidPath" | "invalidFrom") {
  if (value === "") return []
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    /~(?![01])/.test(value)
  ) {
    throw new PatchError(reason)
  }
  return value
    .slice(1)
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"))
}

function arrayIndex(
  key: string,
  length: number,
  allowEnd: boolean,
  reason: "missingPath" | "missingFrom"
) {
  if (key === "-" && allowEnd) return length
  const index = Number(key)
  if (!/^(0|[1-9]\d*)$/.test(key) || index >= length + Number(allowEnd)) {
    throw new PatchError(reason)
  }
  return index
}

function read(
  document: JsonDocument,
  path: readonly string[],
  reason: "missingPath" | "missingFrom"
): JsonValue {
  let value = document
  for (const key of path) {
    if (Array.isArray(value)) {
      value = value[arrayIndex(key, value.length, false, reason)]
    } else if (isObject(value) && Object.hasOwn(value, key)) {
      value = value[key]
    } else {
      throw new PatchError(reason)
    }
  }
  if (value === undefined) throw new PatchError(reason)
  return value
}

function editAt(
  document: JsonDocument,
  path: string[],
  edit: Edit
): JsonDocument {
  const adding = edit.op === "add"
  if (path.length === 0) {
    if (!adding && document === undefined) throw new PatchError("missingPath")
    return edit.op === "remove" ? undefined : edit.value
  }

  const key = path.at(-1)!
  const container = read(document, path.slice(0, -1), "missingPath")
  if (Array.isArray(container)) {
    const index = arrayIndex(key, container.length, adding, "missingPath")
    switch (edit.op) {
      case "add":
        container.splice(index, 0, edit.value)
        break
      case "replace":
        container[index] = edit.value
        break
      case "remove":
        container.splice(index, 1)
        break
    }
  } else {
    if (!isObject(container) || (!adding && !Object.hasOwn(container, key))) {
      throw new PatchError("missingPath")
    }
    if (edit.op === "remove") {
      delete container[key]
    } else {
      // Define an own member even when the key is "__proto__".
      Object.defineProperty(container, key, {
        value: edit.value,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    }
  }
  return document
}

function clone(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(clone)
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, clone(child)])
    )
  }
  return value
}

function numberKey(number: LosslessNumber) {
  // Normalize the decimal without rounding its digits or exponent.
  const [coefficient, exponent = "0"] = number.value.split(/[eE]/)
  const [integer, fraction = ""] = coefficient!.split(".")
  const digits = (integer!.replace("-", "") + fraction).replace(/^0+/, "")
  if (!digits) return "0"

  const significant = digits.replace(/0+$/, "")
  const scale =
    BigInt(exponent) +
    BigInt(digits.length - significant.length - fraction.length)
  const sign = integer!.startsWith("-") ? "-" : ""
  return `${sign}${significant}e${scale}`
}

function equal(left: JsonValue, right: JsonValue): boolean {
  if (left === right) return true
  if (left instanceof LosslessNumber && right instanceof LosslessNumber) {
    return numberKey(left) === numberKey(right)
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => equal(value, right[index]!))
    )
  }
  if (isObject(left) && isObject(right)) {
    const keys = Object.keys(left)
    return (
      keys.length === Object.keys(right).length &&
      keys.every(
        (key) => Object.hasOwn(right, key) && equal(left[key]!, right[key]!)
      )
    )
  }
  return false
}

function requiredValue(operation: JsonObject) {
  if (!Object.hasOwn(operation, "value")) throw new PatchError("missingValue")
  return operation.value!
}

function applyOperation(
  document: JsonDocument,
  operation: JsonValue
): JsonDocument {
  if (!isObject(operation) || typeof operation.op !== "string") {
    throw new PatchError("invalidOperation")
  }

  const op = operation.op
  const path = pointer(operation.path, "invalidPath")
  switch (op) {
    case "add":
    case "replace":
      return editAt(document, path, { op, value: requiredValue(operation) })
    case "remove":
      return editAt(document, path, { op })
    case "test": {
      const expected = requiredValue(operation)
      if (!equal(read(document, path, "missingPath"), expected)) {
        throw new PatchError("testFailed")
      }
      return document
    }
    case "copy":
    case "move": {
      const from = pointer(operation.from, "invalidFrom")
      const value = read(document, from, "missingFrom")
      if (op === "copy")
        return editAt(document, path, { op: "add", value: clone(value) })
      if (
        from.length < path.length &&
        from.every((segment, index) => segment === path[index])
      ) {
        throw new PatchError("invalidMove")
      }
      const remainder = editAt(document, from, { op: "remove" })
      return editAt(remainder, path, { op: "add", value })
    }
    default:
      throw new PatchError("invalidOperation")
  }
}

function parseInput(
  text: string,
  reason: InputError
): { kind: "parsed"; value: JsonValue } | ApplicationError {
  try {
    return {
      kind: "parsed",
      value: parse(text, null, {
        onDuplicateKey: ({ newValue }) => newValue,
      }) as JsonValue,
    }
  } catch (error) {
    return {
      kind: "error",
      reason: error instanceof RangeError ? "documentTooComplex" : reason,
    }
  }
}

function applyOperations(
  document: JsonDocument,
  patch: JsonValue[],
  duplicates: ReadonlySet<number>
): Result {
  for (const [index, operation] of patch.entries()) {
    try {
      if (duplicates.has(index)) throw new PatchError("duplicateOperationField")
      document = applyOperation(document, operation)
    } catch (error) {
      /* v8 ignore next -- Unexpected runtime errors are handled at the application boundary. */
      if (!(error instanceof PatchError)) throw error

      const { op, path, from } = isObject(operation) ? operation : {}
      return {
        kind: "operationError",
        reason: error.reason,
        number: index + 1,
        op: typeof op === "string" ? op : undefined,
        path: typeof path === "string" ? path : undefined,
        from:
          typeof from === "string" && (op === "copy" || op === "move")
            ? from
            : undefined,
      }
    }
  }
  return { kind: "success", text: stringify(document, null, 2) }
}

export function applyJsonPatch(
  originalText: string,
  patchText: string
): Result {
  const original = parseInput(originalText, "invalidOriginal")
  if (original.kind === "error") return original

  const patch = parseInput(patchText, "invalidPatch")
  if (patch.kind === "error") return patch
  if (!Array.isArray(patch.value))
    return { kind: "error", reason: "patchNotArray" }

  try {
    return applyOperations(
      original.value,
      patch.value,
      findDuplicateOperationFields(patchText)
    )
  } catch (error) {
    if (!(error instanceof RangeError)) throw error
    return { kind: "error", reason: "documentTooComplex" }
  }
}
