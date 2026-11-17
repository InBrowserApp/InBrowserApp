import {
  decode as decodeCbor,
  encode as encodeCbor,
  Tagged,
  Token,
  Type,
} from "cborg"
import {
  decode as decodeMsgpack,
  encode as encodeMsgpack,
  ExtData,
  ExtensionCodec,
} from "@msgpack/msgpack"
import {
  checkSize,
  formatBytes,
  parseBytes,
  type Representation,
} from "./bytes"
import { fromJson, parseJson, toJson, type BinaryFormat } from "./typed-json"

export type Request = {
  input: string
  format: BinaryFormat
  direction: "encode" | "decode"
  representation: Representation
  extended: boolean
}
export type Result = {
  text: string
  bytes: Uint8Array
  jsonBytes: number
  typed: boolean
}

function decodeMessagePack(bytes: Uint8Array) {
  // Unique temporary keys avoid prototype setters, numeric-key collisions and
  // duplicate-key loss in the library's object-based map decoder.
  const keys: string[] = []
  const value = decodeMsgpack(bytes, {
    useBigInt64: true,
    maxStrLength: 1024 * 1024,
    maxBinLength: 1024 * 1024,
    maxExtLength: 1024 * 1024,
    maxArrayLength: 1024 * 1024,
    maxMapLength: 1024 * 1024,
    mapKeyConverter: (key) => {
      if (typeof key !== "string")
        throw new Error("MessagePack maps require string keys.")
      keys.push(key)
      return `key${keys.length - 1}`
    },
    extensionCodec: {
      tryToEncode: ExtensionCodec.defaultCodec.tryToEncode.bind(
        ExtensionCodec.defaultCodec
      ),
      decode: (data, type) => new ExtData(type, data),
    },
  })
  function restore(item: unknown, depth = 0): unknown {
    if (depth > 100) throw new Error("Nesting exceeds 100 levels.")
    if (Array.isArray(item))
      return item.map((child) => restore(child, depth + 1))
    if (
      item !== null &&
      typeof item === "object" &&
      !(item instanceof Uint8Array) &&
      !(item instanceof ExtData)
    ) {
      const entries = Object.entries(item).map(
        ([key, child]) =>
          [keys[Number(key.slice(3))]!, restore(child, depth + 1)] as const
      )
      if (new Set(entries.map(([key]) => key)).size !== entries.length)
        throw new Error("Duplicate map keys.")
      return Object.fromEntries(entries)
    }
    return item
  }
  return restore(value)
}

export function convert(request: Request): Result {
  const { input, format, direction, representation, extended } = request
  let bytes: Uint8Array
  let json: unknown
  if (direction === "encode") {
    checkSize(new TextEncoder().encode(input).length)
    const value = fromJson(parseJson(input), format, extended)
    json = toJson(value)
    bytes =
      format === "cbor"
        ? encodeCbor(value, {
            typeEncoders: {
              number: (number) =>
                Object.is(number, -0) ? new Token(Type.float, number) : null,
            },
          })
        : encodeMsgpack(value, {
            useBigInt64: true,
            maxDepth: 100,
            forceIntegerToFloat: JSON.stringify(json).includes('"$float":"-0"'),
          })
    checkSize(bytes.length)
  } else {
    bytes = parseBytes(input, representation)
    const value =
      format === "cbor"
        ? decodeCbor(bytes, {
            useMaps: true,
            rejectDuplicateMapKeys: true,
            rejectInvalidUtf8: true,
            tags: new Proxy(
              {},
              {
                get: (_, tag) => {
                  const number = Number(tag)
                  if (!Number.isSafeInteger(number))
                    throw new Error("CBOR tag exceeds the safe integer range.")
                  return Tagged.decoder(number)
                },
              }
            ),
          })
        : decodeMessagePack(bytes)
    json = toJson(value)
  }
  const jsonText = JSON.stringify(json, null, 2)
  const jsonBytes = new TextEncoder().encode(jsonText).length
  if (jsonBytes > 8 * 1024 * 1024) throw new Error("JSON output exceeds 8 MiB.")
  return {
    text:
      direction === "encode" ? formatBytes(bytes, representation) : jsonText,
    bytes,
    jsonBytes,
    typed:
      /"\$(binary|integer|float|undefined|cborTag|msgpackExt|map)"\s*:/.test(
        jsonText
      ),
  }
}
