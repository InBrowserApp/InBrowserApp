import { concatBytes } from "./encoding"
import { JwtSignerError } from "./errors"

function normalizeEcdsaSignature(
  signature: Uint8Array,
  expectedLength: number
) {
  if (signature.length === expectedLength) {
    return signature
  }

  return derToJoseSignature(signature, expectedLength)
}

function derToJoseSignature(signature: Uint8Array, expectedLength: number) {
  if (signature[0] !== 0x30) {
    throw new JwtSignerError("errorSigningFailed")
  }

  let offset = 1
  const sequenceLength = readDerLength(signature, offset)
  offset = sequenceLength.offset
  if (offset + sequenceLength.length !== signature.length) {
    throw new JwtSignerError("errorSigningFailed")
  }

  const partLength = expectedLength / 2
  const r = readDerInteger(signature, offset, partLength)
  const s = readDerInteger(signature, r.offset, partLength)

  if (s.offset !== signature.length) {
    throw new JwtSignerError("errorSigningFailed")
  }

  return concatBytes(r.value, s.value)
}

function readDerInteger(
  bytes: Uint8Array,
  offset: number,
  targetLength: number
) {
  if (bytes[offset] !== 0x02) {
    throw new JwtSignerError("errorSigningFailed")
  }

  const length = readDerLength(bytes, offset + 1)
  const start = length.offset
  const end = start + length.length
  const value = bytes.slice(start, end)
  const trimmed = trimLeadingZeroes(value)

  if (trimmed.length > targetLength) {
    throw new JwtSignerError("errorSigningFailed")
  }

  const padded = new Uint8Array(targetLength)
  padded.set(trimmed, targetLength - trimmed.length)
  return { value: padded, offset: end } as const
}

function readDerLength(bytes: Uint8Array, offset: number) {
  const first = bytes[offset]
  if (first === undefined) {
    throw new JwtSignerError("errorSigningFailed")
  }

  if (first < 0x80) {
    return { length: first, offset: offset + 1 } as const
  }

  const byteCount = first & 0x7f
  if (byteCount === 0 || byteCount > 4) {
    throw new JwtSignerError("errorSigningFailed")
  }

  let length = 0
  for (let index = 0; index < byteCount; index += 1) {
    const next = bytes[offset + 1 + index]
    if (next === undefined) {
      throw new JwtSignerError("errorSigningFailed")
    }
    length = (length << 8) | next
  }

  return { length, offset: offset + 1 + byteCount } as const
}

function trimLeadingZeroes(bytes: Uint8Array) {
  let offset = 0
  while (offset < bytes.length - 1 && bytes[offset] === 0) {
    offset += 1
  }
  return bytes.slice(offset)
}

export { derToJoseSignature, normalizeEcdsaSignature }
