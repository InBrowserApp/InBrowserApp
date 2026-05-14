import { isJsonObject } from "./jwt-types"

type ClaimCheck =
  | Readonly<{
      code: "payload-not-object" | "invalid-exp" | "invalid-nbf" | "invalid-iat"
      severity: "warning"
    }>
  | Readonly<{
      code: "expired" | "not-yet-valid" | "issued-in-future"
      severity: "danger" | "warning"
      isoDate: string
    }>
  | Readonly<{
      code: "expires-at" | "valid-after" | "issued-at"
      severity: "neutral" | "success"
      isoDate: string
    }>

function inspectJwtClaims(payload: unknown, now = new Date()): ClaimCheck[] {
  if (!isJsonObject(payload)) {
    return [{ code: "payload-not-object", severity: "warning" }]
  }

  return [
    ...inspectNumericDate(payload.exp, "exp", now),
    ...inspectNumericDate(payload.nbf, "nbf", now),
    ...inspectNumericDate(payload.iat, "iat", now),
  ]
}

function inspectNumericDate(
  value: unknown,
  claim: "exp" | "nbf" | "iat",
  now: Date
): ClaimCheck[] {
  if (value === undefined) return []

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return [
      {
        code:
          claim === "exp"
            ? "invalid-exp"
            : claim === "nbf"
              ? "invalid-nbf"
              : "invalid-iat",
        severity: "warning",
      },
    ]
  }

  const isoDate = new Date(value * 1000).toISOString()
  const valueMs = value * 1000
  const nowMs = now.getTime()

  if (claim === "exp") {
    return [
      valueMs <= nowMs
        ? { code: "expired", severity: "danger", isoDate }
        : { code: "expires-at", severity: "success", isoDate },
    ]
  }

  if (claim === "nbf") {
    return [
      valueMs > nowMs
        ? { code: "not-yet-valid", severity: "danger", isoDate }
        : { code: "valid-after", severity: "success", isoDate },
    ]
  }

  return [
    valueMs > nowMs
      ? { code: "issued-in-future", severity: "warning", isoDate }
      : { code: "issued-at", severity: "neutral", isoDate },
  ]
}

export { inspectJwtClaims }
export type { ClaimCheck }
