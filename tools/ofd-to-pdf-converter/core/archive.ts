import { unzipSync } from "fflate"

function normalize(name: string) {
  const parts: string[] = []
  for (const part of name.replace(/\\/g, "/").split("/")) {
    if (!part || part === ".") continue
    if (part === "..") {
      if (!parts.length) throw new Error("invalid")
      parts.pop()
    } else parts.push(part)
  }
  return parts.join("/")
}

export function documentCount(bytes: Uint8Array) {
  let roots = 0
  const files = unzipSync(bytes, {
    filter(entry) {
      if (normalize(entry.name) !== "OFD.xml") return false
      if (++roots > 1) throw new Error("invalid")
      return true
    },
  })
  const data = Object.values(files)[0]
  if (!data) throw new Error("invalid")
  const text = new TextDecoder("utf-8", { fatal: true }).decode(data)
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error("invalid")
  const xml = new DOMParser().parseFromString(text, "application/xml")
  if (
    xml.getElementsByTagName("parsererror").length ||
    xml.documentElement.localName !== "OFD"
  )
    throw new Error("invalid")
  const count = Array.from(xml.documentElement.children).filter(
    (element) => element.localName === "DocBody"
  ).length
  if (!count) throw new Error("invalid")
  return count
}
