import { describe, expect, it, vi } from "vitest"

import { encodeBase64UrlText } from "./jwt-base64"
import { decodeJwt, parseJwt } from "./jwt-decode"

const HEADER = encodeBase64UrlText(JSON.stringify({ alg: "HS256", kid: "a" }))
const PAYLOAD = encodeBase64UrlText(JSON.stringify({ sub: "user" }))
const SIGNATURE = "AQID"
const TOKEN = `${HEADER}.${PAYLOAD}.${SIGNATURE}`

describe("jwt decode", () => {
  it("parses header, payload, signature, and signing input", () => {
    const decoded = parseJwt(TOKEN)

    expect(decoded.header).toEqual({ alg: "HS256", kid: "a" })
    expect(decoded.payload).toEqual({ sub: "user" })
    expect(decoded.payloadObject).toEqual({ sub: "user" })
    expect(decoded.headerJson).toContain('"alg": "HS256"')
    expect(decoded.payloadJson).toContain('"sub": "user"')
    expect(decoded.signingInput).toBe(`${HEADER}.${PAYLOAD}`)
    expect(Array.from(decoded.signature)).toEqual([1, 2, 3])
    expect(decoded.signatureSegment).toBe(SIGNATURE)
    expect(decoded.algorithm).toBe("HS256")
    expect(decoded.keyId).toBe("a")
  })

  it("decodes non-object payloads but marks them as not claim objects", () => {
    const token = `${HEADER}.${encodeBase64UrlText('"value"')}.${SIGNATURE}`

    const decoded = parseJwt(token)

    expect(decoded.payload).toBe("value")
    expect(decoded.payloadObject).toBeNull()
  })

  it("returns structured errors for invalid tokens", () => {
    expect(decodeJwt("")).toEqual({ ok: false, code: "empty-token" })
    expect(decodeJwt("one.two")).toEqual({
      ok: false,
      code: "invalid-segment-count",
    })
    expect(decodeJwt(`.${PAYLOAD}.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "empty-header-or-payload",
    })
    expect(decodeJwt(`*bad.${PAYLOAD}.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "invalid-header-base64",
    })
    expect(decodeJwt(`${HEADER}.*bad.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "invalid-payload-base64",
    })
    expect(decodeJwt(`${HEADER}.${PAYLOAD}.*bad`)).toEqual({
      ok: false,
      code: "invalid-signature-base64",
    })
  })

  it("returns structured errors for invalid JSON parts", () => {
    const text = encodeBase64UrlText("not json")
    const arrayHeader = encodeBase64UrlText("[]")

    expect(decodeJwt(`${text}.${PAYLOAD}.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "invalid-header-json",
    })
    expect(decodeJwt(`${HEADER}.${text}.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "invalid-payload-json",
    })
    expect(decodeJwt(`${arrayHeader}.${PAYLOAD}.${SIGNATURE}`)).toEqual({
      ok: false,
      code: "header-not-object",
    })
  })

  it("returns a structured error for unexpected decode failures", () => {
    const stringify = vi.spyOn(JSON, "stringify").mockImplementationOnce(() => {
      throw new Error("boom")
    })

    try {
      expect(decodeJwt(TOKEN)).toEqual({
        ok: false,
        code: "invalid-payload-json",
      })
    } finally {
      stringify.mockRestore()
    }
  })
})
