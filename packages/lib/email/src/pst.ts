import { Buffer } from "buffer"
import { decompressSync } from "fflate"
import type { PSTFolder, PSTMessage } from "pst-extractor"
import { cleanLabel, contentId, rasterImage, referencedImage } from "./content"
import type { MailSummary } from "./archive"
import type { Attachment, Email, Notice } from "./types"

type Source = {
  read: (target: Buffer, length: number, position: number) => number
  unzip: (data: Buffer) => Buffer
}

const pageSize = 1024 * 1024
const cacheSize = 8
const byteAttachment = 1
const nodeTypeMask = 0x1f
const searchFolder = 0x03

export function pstSource(
  file: Blob,
  read: (part: Blob) => ArrayBuffer
): Source {
  const pages = new Map<number, Uint8Array>()
  return {
    read(target, length, position) {
      if (!Number.isSafeInteger(position) || position < 0)
        throw new Error("invalid")
      const end = Math.min(file.size, position + length)
      let copied = 0
      while (position < end) {
        const page = Math.floor(position / pageSize) * pageSize
        let bytes = pages.get(page)
        if (bytes) pages.delete(page)
        else bytes = new Uint8Array(read(file.slice(page, page + pageSize)))
        pages.set(page, bytes)
        if (pages.size > cacheSize) pages.delete(pages.keys().next().value!)
        const offset = position - page
        const part = bytes.subarray(offset, offset + end - position)
        target.set(part, copied)
        position += part.length
        copied += part.length
      }
      return copied
    },
    unzip: (data) => Buffer.from(decompressSync(data)),
  }
}

function label(name: string, email: string) {
  name = cleanLabel(name)
  email = cleanLabel(email)
  if (name && email && email !== name && !/^\/o=/i.test(email))
    return `${name} <${email}>`
  return name || email
}

function messageSummary(message: PSTMessage, folder: number): MailSummary {
  const date = message.clientSubmitTime || message.messageDeliveryTime
  return {
    subject: cleanLabel(message.subject),
    from: label(
      message.sentRepresentingName || message.senderName,
      message.sentRepresentingEmailAddress || message.senderEmailAddress
    ),
    to: cleanLabel(message.displayTo),
    date: date && Number.isFinite(date.getTime()) ? date.toISOString() : "",
    folder,
  }
}

function isMail(message: PSTMessage) {
  return /^(?:IPM\.Note(?:\.|$)|REPORT\.IPM\.Note\.|IPM\.Schedule\.Meeting\.)/i.test(
    message.messageClass
  )
}

function readAttachments(message: PSTMessage, html: string, notices: Notice[]) {
  const attachments: Attachment[] = []
  const count = message.numberOfAttachments
  for (let i = 0; i < count; i++) {
    try {
      const item = message.getAttachment(i)
      const stream =
        item.attachMethod === byteAttachment ? item.fileInputStream : null
      if (!stream) {
        if (!notices.includes("attachmentError"))
          notices.push("attachmentError")
        continue
      }
      const size = stream.length.toNumber()
      const bytes = new Uint8Array(size)
      if (size) stream.readCompletely(Buffer.from(bytes.buffer))
      const type = item.mimeTag || "application/octet-stream"
      const cid = contentId(item.contentId)
      attachments.push({
        name: cleanLabel(item.longFilename || item.filename),
        type,
        bytes,
        size,
        kind: referencedImage(html, cid) ? "inline" : "attachment",
        ...(cid && rasterImage.test(type) ? { cid } : {}),
      })
    } catch {
      if (!notices.includes("attachmentError")) notices.push("attachmentError")
    }
  }
  return attachments
}

export async function openPst(source: Source) {
  // pst-extractor's browser path uses a byte source and the browser Buffer polyfill.
  globalThis.Buffer ??= Buffer
  const { PSTFile, PSTMessage } = await import("pst-extractor")
  const { PSTUtil } = await import("pst-extractor/dist/PSTUtil.class.js")
  const pst = new PSTFile(source)
  const indexed: {
    summary: MailSummary
    handle: PSTMessage["descriptorNodeId"]
  }[] = []
  const folders: string[] = []
  const root = pst.getRootFolder()
  const pending: { folder: PSTFolder; parent: string }[] = [
    { folder: root, parent: "" },
  ]
  const seen = new Set<string>()
  while (pending.length) {
    const { folder, parent } = pending.pop()!
    // PST search folders are saved queries and can reference mail in other folders.
    if ((folder.descriptorNodeId.toNumber() & nodeTypeMask) === searchFolder)
      continue
    const key = folder.descriptorNodeId.toString()
    if (seen.has(key)) continue
    seen.add(key)
    const folderIndex = folders.length
    const start = indexed.length
    for (
      let next: unknown = folder.getNextChild();
      next;
      next = folder.getNextChild()
    ) {
      if (!(next instanceof PSTMessage) || !isMail(next)) continue
      indexed.push({
        summary: messageSummary(next, folderIndex),
        handle: next.descriptorNodeId,
      })
    }
    const name = cleanLabel(folder.displayName)
    if (
      indexed.length > start ||
      /^IPF\.Note(?:\.|$)/i.test(folder.containerClass)
    )
      folders.push(parent && name ? `${name} — ${parent}` : name || parent)
    const path = [parent, name].filter(Boolean).join(" / ")
    for (const child of folder.getSubFolders().reverse()) {
      pending.push({ folder: child, parent: folder === root ? "" : path })
    }
  }
  indexed.sort((a, b) => b.summary.date.localeCompare(a.summary.date))
  return {
    folders,
    messages: indexed.map(({ summary }) => summary),
    read(id: number): Email {
      const { summary, handle } = indexed[id]!
      const message = PSTUtil.detectAndLoadPSTObject(pst, handle) as PSTMessage
      const html = message.bodyHTML
      const text = message.body
      const notices: Notice[] = []
      if (!html && !text && message.bodyRTF) notices.push("rtfOnly")
      return {
        ...summary,
        format: "PST",
        cc: cleanLabel(message.displayCC),
        bcc: cleanLabel(message.displayBCC),
        html,
        text,
        attachments: readAttachments(message, html, notices),
        notices,
      }
    },
  }
}
