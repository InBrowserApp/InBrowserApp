// Wire format used by Google Authenticator's otpauth-migration:// QR codes.
import protobuf from "protobufjs/minimal.js"
import { Secret } from "otpauth"

import { algorithms, readSetup } from "./accounts"
import type { Setup } from "./accounts"

const { Reader, Writer } = protobuf

function readEntry(bytes: Uint8Array): Setup {
  const reader = new Reader(bytes)
  let secret: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  let label = ""
  let issuer = ""
  let algorithm = 0
  let digitCount = 0
  let type = 0
  let counter = 0

  while (reader.pos < reader.len) {
    const tag = reader.uint32()
    switch (tag) {
      case 10:
        secret = reader.bytes()
        break
      case 18:
        label = reader.string()
        break
      case 26:
        issuer = reader.string()
        break
      case 32:
        algorithm = reader.uint32()
        break
      case 40:
        digitCount = reader.uint32()
        break
      case 48:
        type = reader.uint32()
        break
      case 56:
        counter = Number(reader.int64().toString())
        break
      default:
        reader.skipType(tag & 7)
    }
  }

  if (type > 2) throw new Error("Invalid OTP type")

  const settings = {
    secret: new Secret({ buffer: Uint8Array.from(secret).buffer }).base32,
    label,
    issuer,
    algorithm: algorithms[Math.max(0, algorithm - 1)],
    digits: [6, 6, 8][digitCount],
  }
  return type === 1
    ? readSetup({ ...settings, type: "hotp", counter })
    : readSetup({ ...settings, type: "totp", period: 30 })
}

function parseMigrationLink(link: string): Setup[] {
  const url = new URL(link)
  const data = url.searchParams.get("data")
  if (
    url.protocol !== "otpauth-migration:" ||
    url.hostname !== "offline" ||
    !data
  ) {
    throw new Error("Invalid migration link")
  }

  const bytes = Uint8Array.from(atob(data), (byte) => byte.charCodeAt(0))
  const reader = new Reader(bytes)
  const accounts: Setup[] = []
  while (reader.pos < reader.len) {
    const tag = reader.uint32()
    if (tag === 10) {
      accounts.push(readEntry(reader.bytes()))
    } else {
      reader.skipType(tag & 7)
    }
  }
  if (!accounts.length) throw new Error("No OTP accounts in migration link")
  return accounts
}

function canExportMigration(accounts: readonly Setup[]) {
  return accounts.every(
    (account) =>
      (account.digits === 6 || account.digits === 8) &&
      (account.type === "hotp" || account.period === 30)
  )
}

function encodeMigrationLink(
  accounts: readonly Setup[],
  batchId: number,
  index: number,
  total: number
) {
  const writer = new Writer()
  for (const account of accounts) {
    writer
      .uint32(10)
      .fork()
      .uint32(10)
      .bytes(new Uint8Array(Secret.fromBase32(account.secret).buffer))
      .uint32(18)
      .string(account.label)
      .uint32(26)
      .string(account.issuer)
      .uint32(32)
      .uint32(algorithms.indexOf(account.algorithm) + 1)
      .uint32(40)
      .uint32(account.digits === 6 ? 1 : 2)
      .uint32(48)
      .uint32(account.type === "hotp" ? 1 : 2)
    if (account.type === "hotp") writer.uint32(56).int64(account.counter)
    writer.ldelim()
  }

  // Version, batch size, batch index, batch ID.
  writer
    .uint32(16)
    .int32(1)
    .uint32(24)
    .int32(total)
    .uint32(32)
    .int32(index)
    .uint32(40)
    .int32(batchId)
  const data = btoa(String.fromCharCode(...writer.finish()))
  return `otpauth-migration://offline?data=${encodeURIComponent(data)}`
}

function createMigrationLinks(
  accounts: readonly Setup[],
  fitsQr: (link: string) => boolean = () => true
) {
  const batchSize = 10
  const batchId = crypto.getRandomValues(new Int32Array(1))[0]! & 0x7fffffff
  let batches = Array.from(
    { length: Math.ceil(accounts.length / batchSize) },
    (_, index) => accounts.slice(index * batchSize, (index + 1) * batchSize)
  )

  while (true) {
    const links = batches.map((batch, index) =>
      encodeMigrationLink(batch, batchId, index, batches.length)
    )
    const next = batches.flatMap((batch, index) => {
      if (fitsQr(links[index]!)) return [batch]
      if (batch.length === 1)
        throw new Error("Account exceeds QR code capacity")
      const split = Math.ceil(batch.length / 2)
      return [batch.slice(0, split), batch.slice(split)]
    })
    if (next.length === batches.length) return links
    batches = next
  }
}

export { canExportMigration, createMigrationLinks, parseMigrationLink }
