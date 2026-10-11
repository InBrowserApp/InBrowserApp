import type { Address } from "postal-mime"
import type { Notice } from "./types"

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
