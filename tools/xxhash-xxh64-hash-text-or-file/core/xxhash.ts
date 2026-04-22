import xxhash from "xxhash-wasm"

type XxHashDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

let xxhashApiPromise: ReturnType<typeof xxhash> | undefined

async function hashXxHash(source: Blob) {
  const api = await getXxHashApi()
  const hasher = api.create64()
  const reader = source.stream().getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      hasher.update(value)
    }
  } finally {
    reader.releaseLock()
  }

  return formatXxHashDigest(hasher.digest())
}

function formatXxHashDigest(checksum: bigint): XxHashDigest {
  const bytes = checksumToBytes(checksum)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: checksum.toString(),
    binary: bytesToBinary(bytes),
  }
}

function checksumToBytes(checksum: bigint) {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)

  // Match the legacy Vue implementation and keep the displayed bytes big-endian.
  view.setBigUint64(0, checksum, false)

  return new Uint8Array(buffer)
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    ""
  )
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

function bytesToBinary(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(2).padStart(8, "0")).join(
    ""
  )
}

async function getXxHashApi() {
  xxhashApiPromise ??= xxhash()
  return xxhashApiPromise
}

export { formatXxHashDigest, hashXxHash }
export type { XxHashDigest }
