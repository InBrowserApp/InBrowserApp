import PostalMime from "postal-mime"
import type { Address } from "postal-mime"
import type { Attachment, Email, Notice } from "./types"

export const rasterImage = /^image\/(?:png|jpeg|gif|webp|avif|bmp)$/i
export const cleanLabel = (value: string) =>
  // oxlint-disable-next-line no-control-regex -- Untrusted header labels must not hide text.
  value.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, " ").trim()
export const contentId = (value: string) => value.trim().replace(/^<|>$/g, "")

export function referencedImage(html: string, cid: string) {
  return Array.from(html.matchAll(/cid:([^\s"'<>)]+)/gi), (match) => {
    try {
      return contentId(decodeURIComponent(match[1]!))
    } catch {
      return contentId(match[1]!)
    }
  }).includes(cid)
}

export function address(value?: Address): string {
  if (!value) return ""
  if (value.group)
    return `${value.name}: ${value.group.map(address).join(", ")};`
  return cleanLabel(
    value.name && value.address
      ? `${value.name} <${value.address}>`
      : value.address || value.name
  )
}

export function checkDate(date: string, notices: Notice[]) {
  if (!date || Number.isNaN(Date.parse(date))) notices.push("invalidDate")
}

export async function parseMime(
  bytes: Uint8Array,
  format: "EML" | "EMLX"
): Promise<Email> {
  const notices: Notice[] = []
  if (format === "EMLX") {
    const end = bytes.indexOf(10)
    const count = new TextDecoder().decode(bytes.subarray(0, end)).trim()
    if (end < 0 || !/^\d+$/.test(count) || !Number.isSafeInteger(Number(count)))
      throw new Error("invalid")
    const length = Number(count)
    if (length > bytes.length - end - 1) notices.push("partial")
    bytes = bytes.subarray(end + 1, end + 1 + length)
  }
  const source = new TextDecoder("latin1").decode(bytes)
  const header = source.split(/\r?\n\r?\n/, 1)[0]!
  if (
    !/^(?:subject|from|sender|to|date|mime-version|content-type|received|message-id):/im.test(
      header
    )
  )
    throw new Error("invalid")
  if (/^x-apple-content-length:/im.test(source)) notices.push("partial")
  // A forgiving MIME parser can recover a truncated multipart, but should not
  // make a missing closing boundary look like a complete message.
  const unfolded = source.replace(/\r?\n[\t ]+/g, " ")
  const endings = new Set(
    Array.from(source.matchAll(/^--[^\r\n]+/gm), (match) => match[0].trimEnd())
  )
  for (const match of unfolded.matchAll(
    /^content-type:\s*multipart\/[^\r\n]+?\bboundary\s*=\s*(?:"([^"]+)"|([^;\s]+))/gim
  )) {
    const boundary = match[1] || match[2]!
    if (!endings.has(`--${boundary}--`)) notices.push("partial")
  }
  const parsed = await PostalMime.parse(bytes, {
    forceRfc822Attachments: true,
    maxHeadersSize: Number.MAX_SAFE_INTEGER,
    maxPartCount: Number.MAX_SAFE_INTEGER,
    maxNestingDepth: Number.MAX_SAFE_INTEGER,
  })
  const type =
    parsed.headers.find((item) => item.key === "content-type")?.value || ""
  if (
    /multipart\/encrypted/i.test(type) ||
    (/application\/(?:x-)?pkcs7-mime/i.test(type) &&
      !/smime-type\s*=\s*"?signed-data/i.test(type)) ||
    /^\s*-----BEGIN PGP MESSAGE-----/.test(parsed.text || "")
  )
    throw new Error("protected")
  if (/multipart\/signed|smime-type\s*=\s*"?signed-data/i.test(type))
    notices.push("signed")
  const date = cleanLabel(
    parsed.headers.find((item) => item.key === "date")?.value || ""
  )
  checkDate(date, notices)
  const attachments: Attachment[] = parsed.attachments.map((item) => {
    const data =
      typeof item.content === "string"
        ? new TextEncoder().encode(item.content)
        : new Uint8Array(item.content)
    const cid = contentId(item.contentId || "")
    const image = Boolean(cid && rasterImage.test(item.mimeType))
    const inline =
      image &&
      (item.disposition === "inline" ||
        item.related ||
        referencedImage(parsed.html || "", cid))
    return {
      name: cleanLabel(item.filename || ""),
      type: item.mimeType,
      size: data.byteLength,
      kind:
        item.mimeType === "message/rfc822"
          ? "nested"
          : inline
            ? "inline"
            : "attachment",
      ...(image ? { cid, bytes: data } : {}),
    }
  })
  return {
    format,
    subject: cleanLabel(parsed.subject || ""),
    from: address(parsed.from),
    to: (parsed.to || []).map(address).join(", "),
    cc: (parsed.cc || []).map(address).join(", "),
    bcc: (parsed.bcc || []).map(address).join(", "),
    date,
    html: parsed.html || "",
    text: parsed.text || "",
    attachments,
    notices: [...new Set(notices)],
  }
}
