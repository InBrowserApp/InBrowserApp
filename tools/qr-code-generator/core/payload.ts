import type {
  CalendarContent,
  ContactContent,
  EmailContent,
  LocationContent,
  QrContentState,
  QrContentType,
  QrPayloadResult,
  SmsContent,
  WifiContent,
} from "./content"

function hasText(...values: readonly string[]) {
  return values.some((value) => value.trim() !== "")
}

function escapeQrField(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,")
}

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
}

function formatCalendarDateTime(value: string) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const year = date.getUTCFullYear().toString().padStart(4, "0")
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
  const day = date.getUTCDate().toString().padStart(2, "0")
  const hour = date.getUTCHours().toString().padStart(2, "0")
  const minute = date.getUTCMinutes().toString().padStart(2, "0")
  const second = date.getUTCSeconds().toString().padStart(2, "0")

  return `${year}${month}${day}T${hour}${minute}${second}Z`
}

function parseCoordinate(value: string, min: number, max: number) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? String(parsed)
    : ""
}

function buildWifiPayload(wifi: WifiContent): QrPayloadResult {
  if (!wifi.ssid.trim()) {
    return { missing: "wifiSsid", payload: "" }
  }

  const fields = [
    "WIFI:",
    `T:${wifi.security};`,
    `S:${escapeQrField(wifi.ssid)};`,
    wifi.security !== "nopass" && wifi.password
      ? `P:${escapeQrField(wifi.password)};`
      : "",
    wifi.hidden ? "H:true;" : "",
    ";",
  ]

  return { missing: null, payload: fields.join("") }
}

function buildContactPayload(contact: ContactContent): QrPayloadResult {
  if (!hasText(...Object.values(contact))) {
    return { missing: "contact", payload: "" }
  }

  const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ")
  const fallbackName = contact.organization || contact.email || contact.phone
  const formattedName = name || fallbackName
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeQrField(contact.lastName)};${escapeQrField(
      contact.firstName
    )};;;`,
    formattedName ? `FN:${escapeQrField(formattedName)}` : "",
    contact.organization ? `ORG:${escapeQrField(contact.organization)}` : "",
    contact.title ? `TITLE:${escapeQrField(contact.title)}` : "",
    contact.phone ? `TEL;TYPE=CELL:${escapeQrField(contact.phone)}` : "",
    contact.email ? `EMAIL:${escapeQrField(contact.email)}` : "",
    contact.website ? `URL:${escapeQrField(contact.website)}` : "",
    contact.address ? `ADR:;;${escapeQrField(contact.address)};;;;` : "",
    "END:VCARD",
  ]

  return { missing: null, payload: lines.filter(Boolean).join("\n") }
}

function buildSmsPayload(sms: SmsContent): QrPayloadResult {
  const phone = sms.phone.trim()
  if (!phone) {
    return { missing: "smsPhone", payload: "" }
  }

  const body = sms.message ? `?body=${encodeURIComponent(sms.message)}` : ""
  return { missing: null, payload: `sms:${phone}${body}` }
}

function buildEmailPayload(email: EmailContent): QrPayloadResult {
  const to = email.to.trim()
  if (!to) {
    return { missing: "emailTo", payload: "" }
  }

  const params = new URLSearchParams()
  if (email.subject) params.set("subject", email.subject)
  if (email.body) params.set("body", email.body)
  const query = params.toString()

  return { missing: null, payload: `mailto:${to}${query ? `?${query}` : ""}` }
}

function buildLocationPayload(location: LocationContent): QrPayloadResult {
  const latitude = parseCoordinate(location.latitude, -90, 90)
  const longitude = parseCoordinate(location.longitude, -180, 180)

  if (!latitude || !longitude) {
    return { missing: "locationCoordinates", payload: "" }
  }

  const altitude = location.altitude.trim()
  return {
    missing: null,
    payload: altitude
      ? `geo:${latitude},${longitude},${altitude}`
      : `geo:${latitude},${longitude}`,
  }
}

function buildCalendarPayload(calendar: CalendarContent): QrPayloadResult {
  if (!hasText(calendar.title, calendar.start)) {
    return { missing: "calendarDetails", payload: "" }
  }

  const start = formatCalendarDateTime(calendar.start)
  const end = formatCalendarDateTime(calendar.end)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InBrowser.App//QR Code Generator//EN",
    "BEGIN:VEVENT",
    calendar.title ? `SUMMARY:${escapeCalendarText(calendar.title)}` : "",
    calendar.location
      ? `LOCATION:${escapeCalendarText(calendar.location)}`
      : "",
    calendar.description
      ? `DESCRIPTION:${escapeCalendarText(calendar.description)}`
      : "",
    start ? `DTSTART:${start}` : "",
    end ? `DTEND:${end}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return { missing: null, payload: lines.filter(Boolean).join("\n") }
}

function buildQrPayload(
  type: QrContentType,
  content: QrContentState
): QrPayloadResult {
  switch (type) {
    case "text":
      return content.text.trim()
        ? { missing: null, payload: content.text }
        : { missing: "text", payload: "" }
    case "wifi":
      return buildWifiPayload(content.wifi)
    case "contact":
      return buildContactPayload(content.contact)
    case "sms":
      return buildSmsPayload(content.sms)
    case "phone":
      return content.phone.trim()
        ? { missing: null, payload: `tel:${content.phone.trim()}` }
        : { missing: "phone", payload: "" }
    case "email":
      return buildEmailPayload(content.email)
    case "location":
      return buildLocationPayload(content.location)
    case "calendar":
      return buildCalendarPayload(content.calendar)
  }
}

export { buildQrPayload }
