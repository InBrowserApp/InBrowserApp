import { prepareWebDocument } from "@workspace/web-document"
import { contentId, rasterImage } from "./content"
import type { Email } from "./types"

export type DocumentLabels = Record<
  | "subjectFallback"
  | "from"
  | "to"
  | "cc"
  | "bcc"
  | "date"
  | "unknown"
  | "attachments"
  | "attachmentFallback"
  | "inline"
  | "attachment"
  | "nested"
  | "bytes"
  | "unknownSize"
  | "noBody"
  | "invalidDate"
  | "utcDate"
  | "signed"
  | "remoteNotice"
  | "attachmentNotice"
  | "verificationNotice"
  | "styleNotice",
  string
>

const attributes = new Set([
  "src",
  "href",
  "alt",
  "colspan",
  "rowspan",
  "dir",
  "lang",
  "start",
  "value",
  "reversed",
  "type",
  "id",
  "name",
])
const remote = /^(?:https?:)?\/\//i

function dataImage(bytes: Uint8Array, type: string) {
  let binary = ""
  for (let offset = 0; offset < bytes.length; offset += 8192)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  return `data:${type};base64,${btoa(binary)}`
}

/** A canonical reading copy: sender CSS cannot hide the saved headers/notes. */
export function emailDocument(
  email: Email,
  labels: DocumentLabels,
  options: { links?: "direct" } = {}
) {
  if (email.notices.includes("rtfOnly")) throw new Error("rtfOnly")
  if (
    email.notices.some(
      (notice) => notice === "partial" || notice === "attachmentError"
    )
  )
    throw new Error("incomplete")
  const inert = document.createElement("template").content.ownerDocument
  const source = inert.createElement("html")
  source.innerHTML = email.html
  let omittedRemote = false
  // Parsing is inert. Strip all sender styles before constructing the reading
  // copy; styles cannot affect headers, resource notes, or attachment details.
  for (const style of source.querySelectorAll("style,link")) style.remove()
  for (const element of source.querySelectorAll("*")) {
    for (const attribute of Array.from(element.attributes)) {
      if (
        ["srcset", "background", "poster"].includes(attribute.name) &&
        /(?:^|[\s,])(?:https?:)?\/\//i.test(attribute.value)
      )
        omittedRemote = true
      if (!attributes.has(attribute.name))
        element.removeAttribute(attribute.name)
    }
  }
  for (const image of source.querySelectorAll("img")) {
    let src = image.getAttribute("src")?.trim() || ""
    if (remote.test(src)) {
      omittedRemote = true
      image.remove()
      continue
    }
    if (/^cid:/i.test(src)) {
      try {
        src = decodeURIComponent(src.slice(4))
      } catch {
        src = src.slice(4)
      }
      const matches = email.attachments.filter(
        (item) => item.cid === contentId(src)
      )
      // Ambiguous IDs and missing images must not produce a plausible but
      // incorrect message. Only the attached raster bytes can become a source.
      const item = matches[0]
      if (matches.length !== 1 || !item?.bytes || !rasterImage.test(item.type))
        throw new Error("unsupported")
      image.setAttribute("src", dataImage(item.bytes, item.type))
    } else if (
      !/^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i.test(src)
    ) {
      throw new Error("unsupported")
    }
  }
  const safe = prepareWebDocument(source.outerHTML, {
    emptyText: "",
    headingText: "",
    print: true,
    links: options.links,
  })
  if (safe.notes.local) throw new Error("unsupported")
  omittedRemote ||= safe.notes.remote
  const sanitized = inert.createElement("html")
  sanitized.innerHTML = safe.html
  const page = inert.createElement("html")
  const head = inert.createElement("head")
  const body = inert.createElement("body")
  page.append(head, body)
  body.dir = "auto"
  const text = (tag: string, value: string) => {
    const element = inert.createElement(tag)
    element.textContent = value
    element.dir = "auto"
    return element
  }
  const subject = email.subject || labels.subjectFallback
  head.append(text("title", subject))
  body.append(text("h1", subject))
  const headers = inert.createElement("dl")
  for (const key of ["from", "to", "cc", "bcc", "date"] as const) {
    if ((key === "cc" || key === "bcc") && !email[key]) continue
    headers.append(
      text("dt", labels[key]),
      text("dd", email[key] || labels.unknown)
    )
  }
  body.append(headers)
  if (email.attachments.length) {
    body.append(
      text("h2", labels.attachments),
      text("p", labels.attachmentNotice)
    )
    const list = inert.createElement("ul")
    for (const item of email.attachments) {
      const size =
        item.size === null ? labels.unknownSize : `${item.size} ${labels.bytes}`
      list.append(
        text(
          "li",
          `${item.name || labels.attachmentFallback} — ${item.type} · ${size} · ${labels[item.kind]}`
        )
      )
    }
    body.append(list)
  }
  const notes = [labels.styleNotice, labels.verificationNotice]
  if (omittedRemote) notes.push(labels.remoteNotice)
  for (const notice of email.notices)
    if (notice === "invalidDate" || notice === "utcDate" || notice === "signed")
      notes.push(labels[notice])
  for (const note of notes) body.append(text("p", note))
  body.append(inert.createElement("hr"))
  const content = inert.createElement("article")
  const savedBody = sanitized.querySelector("body")!
  content.dir = savedBody.getAttribute("dir") || "auto"
  const lang = savedBody.getAttribute("lang")
  if (lang) content.lang = lang
  if (email.html.trim() && !safe.empty)
    content.append(...Array.from(savedBody.childNodes))
  else content.append(text("pre", email.text || labels.noBody))
  body.append(content)
  return { html: "<!doctype html>" + page.outerHTML, notes }
}
