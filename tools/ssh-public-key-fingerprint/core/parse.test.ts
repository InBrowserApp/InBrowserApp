import { createHash, webcrypto } from "node:crypto"

import { describe, expect, test, vi } from "vitest"

import { colonizeHex, md5Fingerprint } from "./fingerprint"
import { parseSshPublicKeys } from "./parse"

const encoder = new TextEncoder()
const BufferRef = Buffer
const subtle = webcrypto.subtle

function encodeString(value: string | Uint8Array) {
  const data = typeof value === "string" ? encoder.encode(value) : value
  const result = new Uint8Array(4 + data.length)
  const view = new DataView(result.buffer)

  view.setUint32(0, data.length, false)
  result.set(data, 4)

  return result
}

function concatBytes(...arrays: Uint8Array[]) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const array of arrays) {
    result.set(array, offset)
    offset += array.length
  }

  return result
}

function encodeMpint(bytes: Uint8Array) {
  let start = 0

  while (start < bytes.length - 1 && bytes[start] === 0) {
    start += 1
  }

  let trimmed = bytes.slice(start)

  if (trimmed[0]! & 0x80) {
    const padded = new Uint8Array(trimmed.length + 1)
    padded.set(trimmed, 1)
    trimmed = padded
  }

  return encodeString(trimmed)
}

function buildKeyBlob(keyType: string, fields: Uint8Array[]) {
  return concatBytes(encodeString(keyType), ...fields)
}

function toBase64(bytes: Uint8Array) {
  return BufferRef.from(bytes).toString("base64")
}

function buildOpenSshLine(
  keyType: string,
  fields: Uint8Array[],
  comment?: string
) {
  const blob = buildKeyBlob(keyType, fields)
  const base64 = toBase64(blob)

  return {
    blob,
    line: `${keyType} ${base64}${comment ? ` ${comment}` : ""}`,
  }
}

function buildRawLine(keyType: string, blob: Uint8Array, comment?: string) {
  const base64 = toBase64(blob)

  return `${keyType} ${base64}${comment ? ` ${comment}` : ""}`
}

function expectedFingerprints(blob: Uint8Array) {
  const md5 = createHash("md5").update(blob).digest("hex")
  const sha256 = createHash("sha256")
    .update(blob)
    .digest("base64")
    .replace(/=+$/u, "")

  return {
    md5: `MD5:${colonizeHex(md5)}`,
    sha256: `SHA256:${sha256}`,
  }
}

const ed25519PublicKey = new Uint8Array(32).fill(1)
const rsaExponent = new Uint8Array([0x01, 0x00, 0x01])
const rsaModulus = new Uint8Array(32).fill(0x80)
const dsaP = new Uint8Array(16).fill(0x80)
const dsaQ = new Uint8Array(2).fill(0x11)
const dsaG = new Uint8Array(16).fill(0x22)
const dsaY = new Uint8Array(16).fill(0x33)
const ecdsaPoint = new Uint8Array(65).fill(0x04)
const skApplication = encoder.encode("ssh:application")

const ed25519 = buildOpenSshLine(
  "ssh-ed25519",
  [encodeString(ed25519PublicKey)],
  "user@host"
)
const rsa = buildOpenSshLine(
  "ssh-rsa",
  [encodeMpint(rsaExponent), encodeMpint(rsaModulus)],
  "user@host"
)
const dsa = buildOpenSshLine(
  "ssh-dss",
  [encodeMpint(dsaP), encodeMpint(dsaQ), encodeMpint(dsaG), encodeMpint(dsaY)],
  "user@host"
)
const ecdsa256 = buildOpenSshLine(
  "ecdsa-sha2-nistp256",
  [encodeString("nistp256"), encodeString(ecdsaPoint)],
  "user@host"
)
const ecdsa384 = buildOpenSshLine("ecdsa-sha2-nistp384", [
  encodeString("nistp384"),
  encodeString(ecdsaPoint),
])
const ecdsa521 = buildOpenSshLine("ecdsa-sha2-nistp521", [
  encodeString("nistp521"),
  encodeString(ecdsaPoint),
])
const skEcdsa = buildOpenSshLine(
  "sk-ecdsa-sha2-nistp256@openssh.com",
  [
    encodeString("nistp256"),
    encodeString(ecdsaPoint),
    encodeString(skApplication),
  ],
  "user@host"
)
const skEd25519 = buildOpenSshLine(
  "sk-ssh-ed25519@openssh.com",
  [encodeString(ed25519PublicKey), encodeString(skApplication)],
  "user@host"
)
const unknown = buildOpenSshLine(
  "ssh-unknown",
  [encodeString(ed25519PublicKey)],
  "mystery@host"
)
const rsaZero = buildOpenSshLine(
  "ssh-rsa",
  [encodeMpint(rsaExponent), encodeMpint(new Uint8Array([0]))],
  "zero@host"
)
const emptyKeyTypeBlob = concatBytes(
  encodeString(""),
  new Uint8Array(8).fill(7)
)
const emptyKeyTypeLine = buildRawLine("ssh-ed25519", emptyKeyTypeBlob)
const emptyKeyTypeRfcBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(emptyKeyTypeBlob)}
---- END SSH2 PUBLIC KEY ----`
const rfcBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Subject: example
Comment: "rfc@example.com"
${toBase64(ed25519.blob)}
---- END SSH2 PUBLIC KEY ----`
const rfcBlockNoQuotes = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: no-quotes@example.com
${toBase64(ed25519.blob)}
---- END SSH2 PUBLIC KEY ----`
const rfcBlankLineBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: 'blank@example.com'

${toBase64(ed25519.blob)}
---- END SSH2 PUBLIC KEY ----`
const rfcEmptyCommentBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Comment:
${toBase64(ed25519.blob)}
---- END SSH2 PUBLIC KEY ----`
const rfcEmptyBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: 'empty@example.com'
---- END SSH2 PUBLIC KEY ----`
const rfcShortBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(new Uint8Array([1, 2, 3]))}
---- END SSH2 PUBLIC KEY ----`
const rfcInvalidLengthBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(new Uint8Array([0, 0, 0, 10, 1]))}
---- END SSH2 PUBLIC KEY ----`

describe("parseSshPublicKeys", () => {
  test("parses common SSH key types and computes fingerprints", async () => {
    const input = [
      ed25519.line,
      rsa.line,
      dsa.line,
      ecdsa256.line,
      ecdsa384.line,
      ecdsa521.line,
      skEcdsa.line,
      skEd25519.line,
    ].join("\n")
    const entries = await parseSshPublicKeys(input, subtle)

    expect(entries).toHaveLength(8)
    expect(entries[0]).toMatchObject({
      keyType: "ssh-ed25519",
      keySize: 256,
      curve: "ed25519",
      comment: "user@host",
      fingerprints: expectedFingerprints(ed25519.blob),
    })
    expect(entries[1]).toMatchObject({ keyType: "ssh-rsa", keySize: 256 })
    expect(entries[2]).toMatchObject({ keyType: "ssh-dss", keySize: 128 })
    expect(entries[3]).toMatchObject({
      keyType: "ecdsa-sha2-nistp256",
      keySize: 256,
      curve: "nistp256",
    })
    expect(entries[4]).toMatchObject({ keySize: 384, curve: "nistp384" })
    expect(entries[5]).toMatchObject({ keySize: 521, curve: "nistp521" })
    expect(entries[6]?.keyType).toContain("sk-ecdsa")
    expect(entries[7]?.keyType).toContain("sk-ssh-ed25519")
  })

  test("parses RFC4716 SSH2 blocks and authorized_keys options", async () => {
    const input = [
      rfcBlock,
      rfcBlockNoQuotes,
      rfcBlankLineBlock,
      rfcEmptyCommentBlock,
      `command="echo hello world",no-pty ${ed25519.line}`,
      `# ignored comment\n${unknown.line}`,
    ].join("\n")
    const entries = await parseSshPublicKeys(input, subtle)

    expect(entries).toHaveLength(6)
    expect(entries[0]?.comment).toBe("rfc@example.com")
    expect(entries[1]?.comment).toBe("no-quotes@example.com")
    expect(entries[2]?.comment).toBe("blank@example.com")
    expect(entries[3]?.comment).toBeUndefined()
    expect(entries[4]?.comment).toBe("user@host")
    expect(entries[5]).toMatchObject({
      keyType: "ssh-unknown",
      comment: "mystery@host",
    })
  })

  test("falls back when the parsed blob has no key type", async () => {
    const lineEntries = await parseSshPublicKeys(emptyKeyTypeLine, subtle)
    const blockEntries = await parseSshPublicKeys(emptyKeyTypeRfcBlock, subtle)

    expect(lineEntries).toHaveLength(1)
    expect(lineEntries[0]?.keyType).toBe("ssh-ed25519")
    expect(blockEntries).toHaveLength(1)
    expect(blockEntries[0]?.keyType).toBe("unknown")
  })

  test("handles zero-length mpint values", async () => {
    const entries = await parseSshPublicKeys(rsaZero.line, subtle)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keySize).toBe(0)
  })

  test("returns empty results for empty or invalid input", async () => {
    await expect(parseSshPublicKeys("   ", subtle)).resolves.toEqual([])
    await expect(parseSshPublicKeys("not-a-key", subtle)).resolves.toEqual([])
    await expect(
      parseSshPublicKeys("ssh-ed25519 abc", subtle)
    ).resolves.toEqual([])
    await expect(
      parseSshPublicKeys(`${rfcEmptyBlock}\n${rfcShortBlock}`, subtle)
    ).resolves.toEqual([])
    await expect(
      parseSshPublicKeys(rfcInvalidLengthBlock, subtle)
    ).resolves.toEqual([])
  })

  test("reports missing Web Crypto support when a key is present", async () => {
    await expect(parseSshPublicKeys(ed25519.line, null)).rejects.toThrow(
      "Web Crypto"
    )
  })

  test("uses Buffer fallbacks when browser base64 helpers are unavailable", async () => {
    const originalAtob = globalThis.atob
    const originalBtoa = globalThis.btoa

    try {
      vi.stubGlobal("atob", undefined)
      vi.stubGlobal("btoa", undefined)

      const entries = await parseSshPublicKeys(ed25519.line, subtle)

      expect(entries).toHaveLength(1)
      expect(entries[0]?.fingerprints).toEqual(
        expectedFingerprints(ed25519.blob)
      )
    } finally {
      vi.stubGlobal("atob", originalAtob)
      vi.stubGlobal("btoa", originalBtoa)
    }
  })

  test("skips entries when base64 helpers are unavailable", async () => {
    const originalAtob = globalThis.atob
    const originalBtoa = globalThis.btoa
    const originalBuffer = globalThis.Buffer

    try {
      vi.stubGlobal("atob", undefined)
      vi.stubGlobal("btoa", undefined)
      vi.stubGlobal("Buffer", undefined)

      await expect(parseSshPublicKeys(ed25519.line, subtle)).resolves.toEqual(
        []
      )
    } finally {
      vi.stubGlobal("atob", originalAtob)
      vi.stubGlobal("btoa", originalBtoa)
      vi.stubGlobal("Buffer", originalBuffer)
    }
  })

  test("skips entries when base64 encoding is unavailable", async () => {
    const originalBtoa = globalThis.btoa
    const originalBuffer = globalThis.Buffer

    try {
      vi.stubGlobal("btoa", undefined)
      vi.stubGlobal("Buffer", undefined)

      await expect(parseSshPublicKeys(ed25519.line, subtle)).resolves.toEqual(
        []
      )
    } finally {
      vi.stubGlobal("btoa", originalBtoa)
      vi.stubGlobal("Buffer", originalBuffer)
    }
  })
})

describe("fingerprint formatting", () => {
  test("formats MD5 fingerprints as colon-separated hexadecimal", () => {
    const bytes = encoder.encode("hello")
    const expectedHex = createHash("md5").update(bytes).digest("hex")

    expect(md5Fingerprint(bytes)).toBe(`MD5:${colonizeHex(expectedHex)}`)
    expect(colonizeHex("")).toBe("")
  })
})
