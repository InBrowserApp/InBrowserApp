type NumericDateClaim = "iat" | "exp"

type NumericDateValue =
  | Readonly<{ status: "missing" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "valid"; value: number }>

type JsonObject = Record<string, unknown>

function getNumericDateClaim(
  payloadText: string,
  claim: NumericDateClaim
): NumericDateValue {
  const payload = parsePayloadObject(payloadText)

  if (!payload) {
    return { status: "invalid" }
  }

  const value = payload[claim]

  if (value === undefined) {
    return { status: "missing" }
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { status: "invalid" }
  }

  return { status: "valid", value: Math.trunc(value) }
}

function setNumericDateClaim(
  payloadText: string,
  claim: NumericDateClaim,
  value: number
) {
  const payload = parsePayloadObject(payloadText)

  if (!payload) {
    return null
  }

  return formatPayload({
    ...payload,
    [claim]: Math.trunc(value),
  })
}

function deleteNumericDateClaim(payloadText: string, claim: NumericDateClaim) {
  const payload = parsePayloadObject(payloadText)

  if (!payload) {
    return null
  }

  const nextPayload = { ...payload }
  delete nextPayload[claim]

  return formatPayload(nextPayload)
}

function sameNumericDateValue(left: NumericDateValue, right: NumericDateValue) {
  if (left.status !== right.status) {
    return false
  }

  if (left.status !== "valid") {
    return true
  }

  return right.status === "valid" && left.value === right.value
}

function formatPayload(payload: JsonObject) {
  return `${JSON.stringify(payload, null, 2)}\n`
}

function parsePayloadObject(payloadText: string): JsonObject | null {
  try {
    const value = JSON.parse(payloadText)

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null
    }

    return value as JsonObject
  } catch {
    return null
  }
}

function getCurrentUnixSeconds() {
  return Math.floor(Date.now() / 1000)
}

function formatDateTimeLocalInput(unixSeconds: number) {
  const date = new Date(unixSeconds * 1000)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())
  const hours = padDatePart(date.getHours())
  const minutes = padDatePart(date.getMinutes())
  const seconds = padDatePart(date.getSeconds())

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

function parseDateTimeLocalInput(value: string) {
  if (!value) {
    return null
  }

  const milliseconds = new Date(value).getTime()

  if (!Number.isFinite(milliseconds)) {
    return null
  }

  return Math.floor(milliseconds / 1000)
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0")
}

export {
  deleteNumericDateClaim,
  formatDateTimeLocalInput,
  getCurrentUnixSeconds,
  getNumericDateClaim,
  parseDateTimeLocalInput,
  sameNumericDateValue,
  setNumericDateClaim,
}
export type { NumericDateValue }
