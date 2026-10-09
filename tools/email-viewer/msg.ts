import MsgReader from "@kenjiuno/msgreader"
import type { FieldsData } from "@kenjiuno/msgreader"
import PostalMime from "postal-mime"
import {
  address,
  checkDate,
  cleanLabel,
  contentId,
  rasterImage,
  referencedImage,
} from "./mime"
import type { Attachment, Email, Notice } from "./types"

export async function parseMsg(buffer: ArrayBuffer): Promise<Email> {
  let reader = new MsgReader(buffer)
  reader.parserConfig = { ansiEncoding: "windows-1252" }
  let data = reader.getFileData()
  if (data.error || data.dataType !== "msg") throw new Error("invalid")
  // ANSI MSG files declare their Windows code page separately from the strings.
  if (data.messageCodepage && data.messageCodepage !== 1252) {
    const decoded = new MsgReader(buffer)
    decoded.parserConfig = { ansiEncoding: String(data.messageCodepage) }
    reader = decoded
    data = reader.getFileData()
  }
  if (
    ![
      data.messageClass,
      data.subject,
      data.body,
      data.bodyHtml,
      data.html,
      data.headers,
      data.compressedRtf,
      data.senderName,
      data.clientSubmitTime,
      data.messageDeliveryTime,
    ].some((value) => value !== undefined) &&
    !data.attachments?.length &&
    !data.recipients?.length
  )
    throw new Error("invalid")
  const signed = /smime\.multipartsigned/i.test(data.messageClass || "")
  if (!signed && /smime|encrypted|rpmsg/i.test(data.messageClass || ""))
    throw new Error("protected")
  if (data.messageClass && !/^IPM\.Note(?:\.|$)/i.test(data.messageClass))
    throw new Error("unsupported")
  const notices: Notice[] = signed ? ["signed"] : []
  const headers = await PostalMime.parse((data.headers || "") + "\r\n\r\n", {
    maxHeadersSize: Number.MAX_SAFE_INTEGER,
  })
  const dateHeader = headers.headers.find((item) => item.key === "date")?.value
  const date = cleanLabel(
    dateHeader || data.clientSubmitTime || data.messageDeliveryTime || ""
  )
  if (!dateHeader && date) notices.push("utcDate")
  checkDate(date, notices)
  const person = (item: FieldsData) =>
    cleanLabel(
      item.name && (item.smtpAddress || item.email)
        ? `${item.name} <${item.smtpAddress || item.email}>`
        : item.name || item.smtpAddress || item.email || ""
    )
  const recipients = (kind: "to" | "cc" | "bcc") =>
    (data.recipients || [])
      .filter((item) => item.recipType === kind)
      .map(person)
      .join(", ")
  let html = data.bodyHtml || ""
  if (!html && data.html) {
    const prefix = new TextDecoder("latin1").decode(data.html)
    const charset = prefix.match(/charset\s*=\s*["']?([\w-]+)/i)?.[1]
    const codepage = data.internetCodepage || data.messageCodepage
    const encodings: Record<number, string> = {
      65001: "utf-8",
      1200: "utf-16le",
      1201: "utf-16be",
      932: "shift_jis",
      936: "gbk",
      949: "euc-kr",
      950: "big5",
      20127: "ascii",
      28591: "iso-8859-1",
      50220: "iso-2022-jp",
    }
    const encoding =
      charset ||
      (codepage ? encodings[codepage] || `windows-${codepage}` : "utf-8")
    try {
      html = new TextDecoder(encoding).decode(data.html)
    } catch {
      html = new TextDecoder().decode(data.html)
      notices.push("partial")
    }
  }
  if (!html && !data.body?.trim() && data.compressedRtf?.length)
    notices.push("rtfOnly")
  const attachments: Attachment[] = (data.attachments || []).map((item) => {
    const cid = contentId(item.pidContentId || "")
    const type =
      item.attachMimeTag ||
      (item.innerMsgContent ? "message/rfc822" : "application/octet-stream")
    const image = Boolean(cid && rasterImage.test(type))
    const inline =
      image && (item.attachmentHidden || referencedImage(html, cid))
    const result: Attachment = {
      name: cleanLabel(item.fileName || item.fileNameShort || item.name || ""),
      type,
      size: item.contentLength ?? null,
      kind: item.innerMsgContent ? "nested" : inline ? "inline" : "attachment",
    }
    if (image) {
      try {
        result.cid = cid
        result.bytes = new Uint8Array(reader.getAttachment(item).content)
        result.size = result.bytes.byteLength
      } catch {
        notices.push("attachmentError")
      }
    }
    return result
  })
  if (attachments.some((item) => /pkcs7-signature/i.test(item.type)))
    notices.push("signed")
  return {
    format: "MSG",
    subject: cleanLabel(data.subject || headers.subject || ""),
    from:
      address(headers.from) ||
      cleanLabel(
        [data.senderName, data.senderSmtpAddress || data.senderEmail]
          .filter(Boolean)
          .join(" ")
      ),
    to: (headers.to || []).map(address).join(", ") || recipients("to"),
    cc: (headers.cc || []).map(address).join(", ") || recipients("cc"),
    bcc: (headers.bcc || []).map(address).join(", ") || recipients("bcc"),
    date,
    html,
    text: data.body || "",
    attachments,
    notices: [...new Set(notices)],
  }
}
