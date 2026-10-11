import PostalMime from "postal-mime"
import type { Attachment, Email, Notice, ParseOptions } from "./types"
import {
  address,
  checkDate,
  cleanLabel,
  contentId,
  rasterImage,
  referencedImage,
} from "./content"

export async function parseMime(
  bytes: Uint8Array,
  format: "EML" | "EMLX",
  options?: ParseOptions
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
      (options?.attachmentBytes === "all" || image) &&
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
      ...(image ? { cid } : {}),
      ...(image || options?.attachmentBytes === "all" ? { bytes: data } : {}),
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
