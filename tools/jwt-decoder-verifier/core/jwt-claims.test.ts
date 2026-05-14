import { describe, expect, it } from "vitest"

import { inspectJwtClaims } from "./jwt-claims"

describe("jwt claim inspection", () => {
  const now = new Date("2026-05-14T12:00:00.000Z")
  const toNumericDate = (value: string) => Date.parse(value) / 1000

  it("reports valid registered NumericDate claims", () => {
    expect(
      inspectJwtClaims(
        {
          exp: toNumericDate("2026-05-14T13:00:00.000Z"),
          nbf: toNumericDate("2026-05-14T10:10:00.000Z"),
          iat: toNumericDate("2026-05-14T10:20:00.000Z"),
        },
        now
      )
    ).toEqual([
      {
        code: "expires-at",
        severity: "success",
        isoDate: "2026-05-14T13:00:00.000Z",
      },
      {
        code: "valid-after",
        severity: "success",
        isoDate: "2026-05-14T10:10:00.000Z",
      },
      {
        code: "issued-at",
        severity: "neutral",
        isoDate: "2026-05-14T10:20:00.000Z",
      },
    ])
  })

  it("reports expired, premature, and future-issued tokens", () => {
    expect(
      inspectJwtClaims(
        {
          exp: toNumericDate("2026-05-14T10:10:00.000Z"),
          nbf: toNumericDate("2026-05-14T13:00:00.000Z"),
          iat: toNumericDate("2026-05-14T13:00:00.000Z"),
        },
        now
      )
    ).toEqual([
      {
        code: "expired",
        severity: "danger",
        isoDate: "2026-05-14T10:10:00.000Z",
      },
      {
        code: "not-yet-valid",
        severity: "danger",
        isoDate: "2026-05-14T13:00:00.000Z",
      },
      {
        code: "issued-in-future",
        severity: "warning",
        isoDate: "2026-05-14T13:00:00.000Z",
      },
    ])
  })

  it("reports malformed registered claims", () => {
    expect(
      inspectJwtClaims(
        {
          exp: "soon",
          nbf: Number.NaN,
          iat: Number.POSITIVE_INFINITY,
        },
        now
      )
    ).toEqual([
      { code: "invalid-exp", severity: "warning" },
      { code: "invalid-nbf", severity: "warning" },
      { code: "invalid-iat", severity: "warning" },
    ])
  })

  it("reports non-object payloads and ignores missing registered claims", () => {
    expect(inspectJwtClaims("payload", now)).toEqual([
      { code: "payload-not-object", severity: "warning" },
    ])
    expect(inspectJwtClaims({ sub: "user" }, now)).toEqual([])
  })
})
