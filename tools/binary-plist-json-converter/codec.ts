import {
  buildBinaryPlist,
  decodeBase64,
  encodeBase64,
  isPlistDictionary,
  parseBinaryPlist,
  PlistUid,
} from "rork-plist"
import type { PlistDictionary, PlistValue } from "rork-plist"

type Json = null | string | number | boolean | Json[] | JsonObject
type JsonObject = { [key: string]: Json }

const tags = new Set(["date", "data", "integer", "uid", "dictionary"])

function tagOf(object: JsonObject) {
  const tag = object.$plist
  return typeof tag === "string" &&
    tags.has(tag) &&
    Object.hasOwn(object, "value") &&
    Object.keys(object).length === 2
    ? tag
    : null
}

function toJson(value: PlistValue): Json {
  if (value instanceof Date)
    return { $plist: "date", value: value.toISOString() }
  if (value instanceof Uint8Array)
    return { $plist: "data", value: encodeBase64(value) }
  if (value instanceof PlistUid) return { $plist: "uid", value: value.uid }
  if (typeof value === "bigint")
    return { $plist: "integer", value: value.toString() }
  if (Array.isArray(value)) return value.map(toJson)
  if (isPlistDictionary(value)) {
    const object = Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, toJson(child)])
    )
    return tagOf(object) ? { $plist: "dictionary", value: object } : object
  }
  if (typeof value === "number" && !Number.isFinite(value))
    throw new TypeError("Non-finite plist number")
  return value
}

function dictionary(value: JsonObject): PlistDictionary {
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, fromJson(child)])
  )
}

function fromJson(value: Json): PlistValue {
  if (value === null) throw new TypeError("Null is not a plist value")
  if (Array.isArray(value)) return value.map(fromJson)
  if (typeof value !== "object") {
    if (
      typeof value === "number" &&
      (!Number.isFinite(value) ||
        (Number.isInteger(value) && !Number.isSafeInteger(value)))
    ) {
      throw new TypeError("Unsupported JSON number")
    }
    return value
  }
  const tag = tagOf(value)
  const payload = value.value
  if (tag === null) return dictionary(value)
  if (tag === "date" && typeof payload === "string") {
    const date = new Date(payload)
    if (
      Number.isFinite(date.valueOf()) &&
      date.toISOString() ===
        payload.replace(/(T\d{2}:\d{2}:\d{2})Z$/, "$1.000Z")
    ) {
      return date
    }
  }
  if (tag === "data" && typeof payload === "string")
    return decodeBase64(payload)
  if (
    tag === "integer" &&
    typeof payload === "string" &&
    /^-?\d+$/.test(payload)
  )
    return BigInt(payload)
  if (tag === "uid" && typeof payload === "number") return new PlistUid(payload)
  if (
    tag === "dictionary" &&
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload)
  )
    return dictionary(payload)
  throw new TypeError("Invalid plist type tag")
}

export function plistToJson(bytes: Uint8Array) {
  return JSON.stringify(toJson(parseBinaryPlist(bytes)), null, 2)
}

export function jsonToPlist(text: string) {
  const value = JSON.parse(text.replace(/^\uFEFF/, "")) as Json
  return buildBinaryPlist(fromJson(value))
}

export const exampleJson = JSON.stringify(
  {
    name: "Notebook",
    enabled: true,
    tags: ["personal", "ideas"],
    created: { $plist: "date", value: "2025-01-01T00:00:00.000Z" },
    signature: { $plist: "data", value: "AQID" },
    identifier: { $plist: "integer", value: "9007199254740993" },
  },
  null,
  2
)

export function examplePlist() {
  return new File([new Uint8Array(jsonToPlist(exampleJson))], "notebook.plist")
}
