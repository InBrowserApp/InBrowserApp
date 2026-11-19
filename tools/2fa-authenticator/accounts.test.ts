import { describe, expect, test } from "vitest"

import {
  getCode,
  mergeAccounts,
  parseSetupLink,
  readSetup,
  setupLink,
} from "./accounts"
import { createBackup, readBackup, readSavedAccounts } from "./backups"
import { parseImportLink } from "./import"

const rfc4226Key = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
const hotp = {
  type: "hotp",
  issuer: "Example Lab",
  label: "hardware@example.com",
  secret: rfc4226Key,
  algorithm: "SHA1",
  counter: 0,
  digits: 6,
} as const

describe("authenticator accounts", () => {
  test("generates HOTP test vectors from RFC 4226", () => {
    expect([0, 1, 2, 3].map((counter) => getCode(hotp, counter))).toEqual([
      "755224",
      "287082",
      "359152",
      "969429",
    ])
  })

  test.each([
    ["SHA1", rfc4226Key, "94287082"],
    [
      "SHA256",
      "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA",
      "46119246",
    ],
    [
      "SHA512",
      "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA",
      "90693936",
    ],
  ])(
    "generates the 59-second TOTP vector for %s from RFC 6238",
    (algorithm, secret, expected) => {
      const period = 30
      const setup = readSetup({
        ...hotp,
        type: "totp",
        secret,
        algorithm,
        digits: 8,
        period,
      })
      expect(getCode(setup, Math.floor(59 / period))).toBe(expected)
    }
  )

  test("normalizes a formatted key and rejects mistyped or truncated keys", () => {
    expect(readSetup({ ...hotp, secret: "mzxw 6=== " }).secret).toBe("MZXW6")
    expect(() => readSetup({ ...hotp, secret: "A" })).toThrow("Invalid Base32")
    expect(() => readSetup({ ...hotp, secret: "MY1" })).toThrow(
      "Invalid Base32"
    )
    expect(() => readSetup({ ...hotp, secret: "MZ" })).toThrow("Invalid Base32")
    expect(() =>
      parseSetupLink("otpauth://totp/Example?secret=JBSWY3DPEHPK3PXPA")
    ).toThrow("Invalid Base32")
  })

  test("imports standard links and preserves non-default parameters when exported", async () => {
    const link =
      "otpauth://totp/Example%20Mail:demo%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example%20Mail&algorithm=SHA512&digits=8&period=60"
    const [setup] = await parseImportLink(link)
    expect(setup).toMatchObject({
      type: "totp",
      label: "demo@example.com",
      issuer: "Example Mail",
      algorithm: "SHA512",
      digits: 8,
      period: 60,
    })
    expect(parseSetupLink(setupLink(setup!))).toEqual(setup)
    expect(parseSetupLink(setupLink(hotp))).toEqual(hotp)
    expect(
      parseSetupLink("otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP")
    ).toMatchObject({ digits: 6, algorithm: "SHA1", period: 30 })
  })

  test("re-importing a HOTP account keeps its advanced counter and avoids duplicate accounts", () => {
    const [advanced] = mergeAccounts([], [{ ...hotp, counter: 100 }])
    const current = [advanced!]
    expect(mergeAccounts(current, [hotp])).toBe(current)
    expect(mergeAccounts(current, [{ ...hotp, label: "backup" }])).toHaveLength(
      2
    )
  })

  test("round trips a backup and validates stored accounts at the boundary", () => {
    const saved = mergeAccounts([], [hotp])
    expect(readBackup(createBackup(saved))).toEqual([hotp])
    expect(readSavedAccounts(JSON.stringify(saved))).toEqual(saved)
    expect(readSavedAccounts(null)).toEqual([])
    expect(() =>
      readBackup(
        '{"format":"inbrowser-authenticator","version":2,"accounts":[]}'
      )
    ).toThrow(/version/)
    expect(() => readSavedAccounts('[{"id":"untrusted"}]')).toThrow(/type/)
  })
})
