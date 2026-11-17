import { Tagged } from "cborg"
import { ExtData } from "@msgpack/msgpack"
import { parse } from "lossless-json"
import { formatBytes, parseBytes } from "./bytes"

export type BinaryFormat = "cbor" | "msgpack"
const WRAPPERS = new Set([
  "$binary",
  "$integer",
  "$float",
  "$undefined",
  "$cborTag",
  "$msgpackExt",
  "$map",
])

function depthCheck(depth: number) {
  if (depth > 100) throw new Error("Nesting exceeds 100 levels.")
}

export function parseJson(text: string): unknown {
  return parse(text, null, (source: string) => {
    if (/^-?\d+$/.test(source) && source !== "-0") {
      const integer = BigInt(source)
      return integer > BigInt(Number.MAX_SAFE_INTEGER) ||
        integer < BigInt(Number.MIN_SAFE_INTEGER)
        ? integer
        : Number(source)
    }
    const number = Number(source)
    if (
      !Number.isFinite(number) ||
      (number === 0 && /[1-9]/.test(source.split(/[eE]/)[0]!))
    ) {
      throw new Error("JSON number overflows or underflows IEEE 754.")
    }
    return number
  })
}

export function fromJson(
  value: unknown,
  format: BinaryFormat,
  extended: boolean,
  depth = 0
): unknown {
  depthCheck(depth)
  if (
    typeof value === "string" &&
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(
      value
    )
  )
    throw new Error("JSON contains an unpaired Unicode surrogate.")
  const visit = (item: unknown) => fromJson(item, format, extended, depth + 1)
  if (Array.isArray(value)) return value.map(visit)
  if (typeof value === "bigint") {
    const minimum = format === "cbor" ? -(1n << 64n) : -(1n << 63n)
    if (value < minimum || value >= 1n << 64n)
      throw new Error(
        "Integer is outside this format’s 64-bit range. Use a CBOR bignum tag for larger values."
      )
  }
  if (value === null || typeof value !== "object") return value
  const object = value as Record<string, unknown>
  const keys = Object.keys(object)
  if (extended && keys.length === 1 && WRAPPERS.has(keys[0]!)) {
    const key = keys[0]!
    const raw = object[key]
    if (key === "$binary" && typeof raw === "string")
      return raw === "" ? new Uint8Array() : parseBytes(raw, "base64")
    if (
      key === "$integer" &&
      typeof raw === "string" &&
      /^-?(0|[1-9]\d*)$/.test(raw)
    )
      return visit(BigInt(raw))
    if (
      key === "$float" &&
      typeof raw === "string" &&
      ["NaN", "Infinity", "-Infinity", "-0"].includes(raw)
    )
      return Number(raw)
    if (key === "$undefined" && raw === true && format === "cbor")
      return undefined
    if (
      key === "$cborTag" &&
      format === "cbor" &&
      Array.isArray(raw) &&
      raw.length === 2 &&
      Number.isSafeInteger(raw[0]) &&
      Number(raw[0]) >= 0
    )
      return new Tagged(Number(raw[0]), visit(raw[1]))
    if (
      key === "$msgpackExt" &&
      format === "msgpack" &&
      Array.isArray(raw) &&
      raw.length === 2 &&
      Number.isInteger(raw[0]) &&
      Number(raw[0]) >= -128 &&
      Number(raw[0]) <= 127 &&
      typeof raw[1] === "string"
    )
      return new ExtData(
        Number(raw[0]),
        raw[1] === "" ? new Uint8Array() : parseBytes(raw[1], "base64")
      )
    if (
      key === "$map" &&
      Array.isArray(raw) &&
      raw.every((pair) => Array.isArray(pair) && pair.length === 2)
    ) {
      const entries = raw.map(
        (pair) => [visit(pair[0]), visit(pair[1])] as const
      )
      const map = new Map(entries)
      if (map.size !== entries.length) throw new Error("Duplicate map keys.")
      if (format === "msgpack") {
        if (entries.some(([key]) => typeof key !== "string"))
          throw new Error("MessagePack maps require string keys.")
        return Object.fromEntries(entries)
      }
      return map
    }
    throw new Error(`Invalid or incompatible ${key} wrapper for ${format}.`)
  }
  return Object.fromEntries(
    Object.entries(object).map(([key, item]) => [visit(key), visit(item)])
  )
}

export function projectJson(value: unknown, depth = 0) {
  const traits = { typed: false, negativeZero: false }
  function wrap(key: string, item: unknown) {
    traits.typed = true
    return { [key]: item }
  }
  function visit(value: unknown, depth: number): unknown {
    depthCheck(depth)
    const child = (item: unknown) => visit(item, depth + 1)
    if (typeof value === "bigint") return wrap("$integer", value.toString())
    if (
      typeof value === "number" &&
      (!Number.isFinite(value) || Object.is(value, -0))
    ) {
      const negativeZero = Object.is(value, -0)
      if (negativeZero) traits.negativeZero = true
      return wrap("$float", negativeZero ? "-0" : String(value))
    }
    if (value === undefined) return wrap("$undefined", true)
    if (value instanceof Uint8Array)
      return wrap("$binary", formatBytes(value, "base64"))
    if (value instanceof Tagged)
      return wrap("$cborTag", [value.tag, child(value.value)])
    if (value instanceof ExtData)
      return wrap("$msgpackExt", [
        value.type,
        formatBytes(value.data as Uint8Array, "base64"),
      ])
    if (Array.isArray(value)) return value.map(child)
    if (value !== null && typeof value === "object") {
      const entries =
        value instanceof Map ? [...value.entries()] : Object.entries(value)
      if (
        entries.some(([key]) => typeof key !== "string") ||
        (entries.length === 1 && WRAPPERS.has(entries[0]![0]))
      ) {
        return wrap(
          "$map",
          entries.map(([key, item]) => [child(key), child(item)])
        )
      }
      return Object.fromEntries(
        entries.map(([key, item]) => [key, child(item)])
      )
    }
    return value
  }
  return { value: visit(value, depth), ...traits }
}
