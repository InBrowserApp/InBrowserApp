import { create } from "qrcode"
import { expect, test } from "vitest"

import { getCode } from "./accounts"
import { parseImportLink } from "./import"
import {
  canExportMigration,
  createMigrationLinks,
  parseMigrationLink,
} from "./migration"

const common = {
  issuer: "Example Mail",
  label: "demo@example.com",
  secret: "MZXW6",
  algorithm: "SHA1",
  digits: 6,
} as const

const totp = { ...common, type: "totp", period: 30 } as const

test("reads a migration QR with Google's unspecified enum defaults", async () => {
  // Payload contains a single account with a three-byte key, name, and issuer.
  const data = Uint8Array.of(
    10,
    11,
    10,
    3,
    102,
    111,
    111,
    18,
    1,
    117,
    26,
    1,
    115,
    16,
    1
  )
  const link = `otpauth-migration://offline?data=${encodeURIComponent(btoa(String.fromCharCode(...data)))}`
  await expect(parseImportLink(link)).resolves.toEqual([
    { ...totp, label: "u", issuer: "s" },
  ])
})

test("exports a batch of QR codes without changing the secret bytes or HOTP counter", () => {
  const hotp = {
    ...common,
    type: "hotp",
    counter: 2 ** 36,
    algorithm: "SHA512",
    digits: 8,
  } as const
  const accounts = Array.from({ length: 11 }, (_, index) => ({
    ...(index % 2 === 0 ? totp : hotp),
    label: `Account ${index}`,
  }))
  expect(canExportMigration(accounts)).toBe(true)
  const links = createMigrationLinks(accounts)
  expect(links).toHaveLength(2)
  expect(links.flatMap(parseMigrationLink)).toEqual(accounts)
  expect(getCode(parseMigrationLink(links[0]!)[1]!, hotp.counter)).toBe(
    getCode(hotp, hotp.counter)
  )
})

test("rejects empty or invalid migration links and detects non-portable settings", () => {
  expect(() =>
    parseMigrationLink("otpauth-migration://offline?data=EAE%3D")
  ).toThrow("No OTP accounts")
  expect(() =>
    parseMigrationLink("otpauth-migration://other?data=EAE%3D")
  ).toThrow("Invalid migration link")
  expect(canExportMigration([{ ...totp, type: "totp", period: 45 }])).toBe(
    false
  )
  expect(canExportMigration([{ ...totp, digits: 7 }])).toBe(false)
})

test("splits a batch that is too large for the QR encoder", () => {
  const accounts = Array.from({ length: 10 }, (_, index) => ({
    ...totp,
    issuer: "Example provider ".repeat(6),
    label: `Account ${index} ${"long account name ".repeat(6)}`,
    secret:
      "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA",
    algorithm: "SHA512" as const,
    digits: 8,
  }))
  function fitsQr(link: string) {
    try {
      create(link, { errorCorrectionLevel: "L" })
      return true
    } catch {
      return false
    }
  }

  expect(fitsQr(createMigrationLinks(accounts)[0]!)).toBe(false)
  const links = createMigrationLinks(accounts, fitsQr)
  expect(links).toHaveLength(2)
  expect(links.every(fitsQr)).toBe(true)
  expect(links.flatMap(parseMigrationLink)).toEqual(accounts)
})
