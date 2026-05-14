import { describe, expect, it } from "vitest"

import {
  bytesToPem,
  decodeBase64,
  decodeBase64Url,
  decodeBase64UrlText,
  encodeBase64Url,
  encodeBase64UrlText,
} from "./jwt-base64"

describe("jwt base64 helpers", () => {
  it("round-trips base64url text and bytes", () => {
    const encoded = encodeBase64UrlText('{"sub":"user"}')

    expect(encoded).toBe("eyJzdWIiOiJ1c2VyIn0")
    expect(decodeBase64UrlText(encoded)).toBe('{"sub":"user"}')
    expect(encodeBase64Url(decodeBase64Url(encoded))).toBe(encoded)
  })

  it("decodes padded base64 input for PEM bodies", () => {
    expect(Array.from(decodeBase64("AQIDBA=="))).toEqual([1, 2, 3, 4])
  })

  it("formats PEM bodies with the requested label", () => {
    const pem = bytesToPem("PUBLIC KEY", new Uint8Array([1, 2, 3, 4]))

    expect(pem).toBe(
      "-----BEGIN PUBLIC KEY-----\nAQIDBA==\n-----END PUBLIC KEY-----"
    )
    expect(bytesToPem("EMPTY", new Uint8Array())).toBe(
      "-----BEGIN EMPTY-----\n\n-----END EMPTY-----"
    )
  })

  it("rejects invalid base64url characters and lengths", () => {
    expect(() => decodeBase64Url("abc*")).toThrow("Invalid base64url data")
    expect(() => decodeBase64Url("a")).toThrow("Invalid base64 length")
  })

  it("rejects invalid standard base64 characters", () => {
    expect(() => decodeBase64("AQID*")).toThrow("Invalid base64 data")
  })
})
