import { JwkPemError, type Asn1Element } from './jwkPemTypes'

export function readAsn1Element(bytes: Uint8Array, offset: number): Asn1Element {
  const tag = bytes[offset]
  if (tag === undefined) {
    throw new JwkPemError('errorInvalidPem')
  }

  const lengthByte = bytes[offset + 1]
  if (lengthByte === undefined) {
    throw new JwkPemError('errorInvalidPem')
  }

  let length = 0
  let headerLength = 2

  if (lengthByte < 0x80) {
    length = lengthByte
  } else {
    const numBytes = lengthByte & 0x7f
    if (numBytes === 0 || offset + 2 + numBytes > bytes.length) {
      throw new JwkPemError('errorInvalidPem')
    }
    length = 0
    for (let i = 0; i < numBytes; i += 1) {
      length = (length << 8) | bytes[offset + 2 + i]!
    }
    headerLength = 2 + numBytes
  }

  const valueStart = offset + headerLength
  const valueEnd = valueStart + length
  if (valueEnd > bytes.length) {
    throw new JwkPemError('errorInvalidPem')
  }

  return {
    tag,
    length,
    headerLength,
    start: offset,
    valueStart,
    valueEnd,
    end: valueEnd,
  }
}

export function readAsn1Children(bytes: Uint8Array, element: Asn1Element): Asn1Element[] {
  const children: Asn1Element[] = []
  let offset = element.valueStart
  while (offset < element.valueEnd) {
    const child = readAsn1Element(bytes, offset)
    children.push(child)
    offset = child.end
  }
  if (offset !== element.valueEnd) {
    throw new JwkPemError('errorInvalidPem')
  }
  return children
}

export function decodeOid(bytes: Uint8Array): string {
  if (!bytes.length) {
    return ''
  }
  const first = bytes[0]!
  const values: number[] = [Math.floor(first / 40), first % 40]

  let value = 0
  for (let i = 1; i < bytes.length; i += 1) {
    value = (value << 7) | (bytes[i]! & 0x7f)
    if ((bytes[i]! & 0x80) === 0) {
      values.push(value)
      value = 0
    }
  }

  return values.join('.')
}

export function encodeOid(oid: string): Uint8Array {
  const parts = oid.split('.').map((part) => Number(part))
  if (parts.length < 2) {
    throw new JwkPemError('errorInvalidPem')
  }

  const first = parts[0]! * 40 + parts[1]!
  const bytes: number[] = [first]

  for (const part of parts.slice(2)) {
    const stack: number[] = []
    let value = part
    do {
      stack.unshift(value & 0x7f)
      value >>= 7
    } while (value > 0)

    for (let i = 0; i < stack.length; i += 1) {
      const isLast = i === stack.length - 1
      bytes.push(isLast ? stack[i]! : stack[i]! | 0x80)
    }
  }

  return encodeTag(0x06, new Uint8Array(bytes))
}

export function encodeLength(length: number): Uint8Array {
  if (length < 0x80) {
    return new Uint8Array([length])
  }

  const bytes: number[] = []
  let value = length
  while (value > 0) {
    bytes.unshift(value & 0xff)
    value >>= 8
  }

  return new Uint8Array([0x80 | bytes.length, ...bytes])
}

export function encodeTag(tag: number, value: Uint8Array): Uint8Array {
  return concatBytes(new Uint8Array([tag]), encodeLength(value.length), value)
}

export function encodeSequence(...parts: Uint8Array[]): Uint8Array {
  return encodeTag(0x30, concatBytes(...parts))
}

export function encodeOctetString(value: Uint8Array): Uint8Array {
  return encodeTag(0x04, value)
}

export function encodeBitString(value: Uint8Array): Uint8Array {
  return encodeTag(0x03, concatBytes(new Uint8Array([0]), value))
}

export function encodeInteger(value: number): Uint8Array {
  if (value === 0) {
    return new Uint8Array([0x02, 0x01, 0x00])
  }
  if (value < 0x80) {
    return new Uint8Array([0x02, 0x01, value])
  }
  const bytes: number[] = []
  let current = value
  while (current > 0) {
    bytes.unshift(current & 0xff)
    current >>= 8
  }
  return encodeTag(0x02, new Uint8Array(bytes))
}

export function encodeNull(): Uint8Array {
  return new Uint8Array([0x05, 0x00])
}

export function extractBitString(der: Uint8Array, element: Asn1Element): Uint8Array {
  const bytes = der.slice(element.valueStart, element.valueEnd)
  if (!bytes.length) {
    return new Uint8Array()
  }
  return bytes.slice(1)
}

export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}
