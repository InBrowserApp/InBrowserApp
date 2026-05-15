type QRCodeContentKind =
  | "text"
  | "url"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "vcard"
  | "calendar"
  | "location"

type QRCodeContent = Readonly<{
  href: string | null
  kind: QRCodeContentKind
}>

const domainLikePattern =
  /^(?:www\.)?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+(?:[/?#][^\s]*)?$/i

function parseHttpUrl(value: string) {
  const trimmed = value.trim()

  try {
    const url = new URL(trimmed)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null
  } catch {
    if (!domainLikePattern.test(trimmed)) {
      return null
    }

    return new URL(`https://${trimmed}`).toString()
  }
}

function classifyQrContent(value: string): QRCodeContent {
  const trimmed = value.trim()
  const httpUrl = parseHttpUrl(trimmed)

  if (httpUrl) {
    return { href: httpUrl, kind: "url" }
  }

  if (/^mailto:/i.test(trimmed)) {
    return { href: trimmed, kind: "email" }
  }

  if (/^tel:/i.test(trimmed)) {
    return { href: trimmed, kind: "phone" }
  }

  if (/^sms:/i.test(trimmed)) {
    return { href: trimmed, kind: "sms" }
  }

  if (/^geo:/i.test(trimmed)) {
    return { href: trimmed, kind: "location" }
  }

  if (/^WIFI:/i.test(trimmed)) {
    return { href: null, kind: "wifi" }
  }

  if (/^BEGIN:VCARD/i.test(trimmed)) {
    return { href: null, kind: "vcard" }
  }

  if (/^BEGIN:VCALENDAR/i.test(trimmed)) {
    return { href: null, kind: "calendar" }
  }

  return { href: null, kind: "text" }
}

export { classifyQrContent, parseHttpUrl }
export type { QRCodeContentKind }
