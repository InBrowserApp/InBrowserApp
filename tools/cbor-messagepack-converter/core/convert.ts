import {
  decode as decodeCbor,
  encode as encodeCbor,
  Tagged,
  Token,
  Type,
} from "cborg"
import { encode as encodeMsgpack } from "@msgpack/msgpack"
import {
  checkSize,
  formatBytes,
  parseBytes,
  type Representation,
} from "./bytes"
import {
  fromJson,
  parseJson,
  projectJson,
  type BinaryFormat,
} from "./typed-json"
import { decodeMessagePack } from "./messagepack"

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

export function convert(request: Request): Result {
  const { input, format, direction, representation, extended } = request
  let bytes: Uint8Array
  let projection: ReturnType<typeof projectJson>
  if (direction === "encode") {
    checkSize(new TextEncoder().encode(input).length)
    const value = fromJson(parseJson(input), format, extended)
    projection = projectJson(value)
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
            forceIntegerToFloat: projection.negativeZero,
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
    projection = projectJson(value)
  }
  const jsonText = JSON.stringify(projection.value, null, 2)
  const jsonBytes = new TextEncoder().encode(jsonText).length
  if (jsonBytes > 8 * 1024 * 1024) throw new Error("JSON output exceeds 8 MiB.")
  return {
    text:
      direction === "encode" ? formatBytes(bytes, representation) : jsonText,
    bytes,
    jsonBytes,
    typed: projection.typed,
  }
}
