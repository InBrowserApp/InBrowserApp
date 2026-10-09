const FB2 = "http://www.gribuser.ru/xml/fictionbook/2.0"
const XLINK = "http://www.w3.org/1999/xlink"
const raster = /^image\/(?:png|jpeg|gif|bmp|webp|avif)$/i

function decode(bytes: Uint8Array) {
  const utf16 =
    (bytes[0] === 255 && bytes[1] === 254) ||
    (bytes[0] === 60 && bytes[1] === 0)
      ? "utf-16le"
      : (bytes[0] === 254 && bytes[1] === 255) ||
          (bytes[0] === 0 && bytes[1] === 60)
        ? "utf-16be"
        : null
  let text = new TextDecoder(utf16 ?? "utf-8").decode(bytes)
  const declaration = /^<\?xml\s[^?]*\?>/.exec(text)?.[0]
  const declared = /\bencoding\s*=\s*['"]([^'"]+)['"]/.exec(
    declaration ?? ""
  )?.[1]
  const bom = bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191
  const encoding = utf16 ?? (bom ? "utf-8" : (declared ?? "utf-8"))
  let decoder: TextDecoder
  try {
    decoder = new TextDecoder(encoding, { fatal: true })
  } catch {
    throw new Error("encoding")
  }
  text = decoder.decode(bytes)
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error("invalid")
  return text
}

/** Normalize namespaces/encoding before the converter can create resources. */
export function normalize(bytes: Uint8Array) {
  const source = new DOMParser().parseFromString(
    decode(bytes),
    "application/xml"
  )
  const root = source.documentElement
  if (
    source.querySelector("parsererror") ||
    root.localName !== "FictionBook" ||
    (root.namespaceURI && root.namespaceURI !== FB2)
  )
    throw new Error("invalid")
  const doc = document.implementation.createDocument(null, "FictionBook")
  const pending: [Node, Node][] = [[root, doc.documentElement]]
  let missing = Boolean(source.querySelector("stylesheet"))
  while (pending.length) {
    const [from, to] = pending.pop()!
    for (const node of from.childNodes) {
      if (
        node.nodeType === Node.TEXT_NODE ||
        node.nodeType === Node.CDATA_SECTION_NODE
      ) {
        to.appendChild(doc.createTextNode(node.textContent!))
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        if (element.namespaceURI && element.namespaceURI !== FB2) {
          missing = true
          continue
        }
        const copy = doc.createElement(element.localName)
        for (const attribute of element.attributes) {
          if (
            attribute.namespaceURI === XLINK &&
            attribute.localName === "href"
          )
            copy.setAttributeNS(XLINK, "l:href", attribute.value)
          else if (!attribute.namespaceURI && !/^on/i.test(attribute.name))
            copy.setAttribute(attribute.name, attribute.value)
        }
        to.appendChild(copy)
        pending.push([element, copy])
      }
    }
  }
  const supported = new Set(
    "body section title epigraph image annotation p poem subtitle cite empty-line table text-author strong emphasis style a strikethrough sub sup code tr th td date stanza v".split(
      " "
    )
  )
  for (const body of doc.querySelectorAll("FictionBook > body")) {
    for (const child of body.querySelectorAll("*")) {
      if (!supported.has(child.localName)) {
        child.remove()
        missing = true
      }
    }
    for (const child of body.children) {
      if (
        !["section", "title", "image", "epigraph"].includes(child.localName)
      ) {
        child.remove()
        missing = true
      }
    }
  }
  const bins = new Map<string, Element>()
  for (const bin of doc.querySelectorAll("FictionBook > binary")) {
    const base64 = bin.textContent!.replace(/\s/g, "")
    if (
      !bin.id ||
      bins.has(bin.id) ||
      !raster.test(bin.getAttribute("content-type") ?? "") ||
      !base64 ||
      base64.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)
    ) {
      missing = true
      bin.remove()
    } else {
      bin.textContent = base64
      bins.set(bin.id, bin)
    }
  }
  for (const image of doc.querySelectorAll("image")) {
    const href = image.getAttributeNS(XLINK, "href") ?? ""
    if (!href.startsWith("#") || !bins.has(href.slice(1))) {
      image.remove()
      missing = true
    }
  }
  const bodies = Array.from(doc.documentElement.children).filter(
    (el) => el.localName === "body"
  )
  if (
    !bodies.length ||
    !bodies.some(
      (body) => body.textContent?.trim() || body.querySelector("image")
    )
  )
    throw new Error("empty")
  // The converter splits the first body's direct children, including titles.
  // Put an empty first body aside if a later body contains the readable text.
  if (!bodies[0]!.children.length) bodies[0]!.remove()
  if (
    !doc.querySelector(
      "body > section, body > title, body > image, body > epigraph"
    )
  )
    throw new Error("empty")
  const ids = new Set<string>()
  // Binary IDs address resources, while rendered IDs address reading targets.
  // Some writers reuse the binary ID on the referring image itself.
  for (const element of doc.querySelectorAll("[id]:not(binary)")) {
    if (ids.has(element.id)) {
      throw new Error("invalid")
    } else ids.add(element.id)
  }
  let nextId = 0
  for (const section of doc.querySelectorAll("body section")) {
    if (section.id) continue
    do {
      section.id = `fb2-section-${nextId++}`
    } while (ids.has(section.id))
    ids.add(section.id)
  }
  const coverId = doc
    .querySelector("coverpage image")
    ?.getAttributeNS(XLINK, "href")
    ?.slice(1)
  const cover = coverId ? bins.get(coverId)! : null
  return {
    doc,
    missing,
    cover: cover
      ? new Blob(
          [
            Uint8Array.from(atob(cover.textContent!), (char) =>
              char.charCodeAt(0)
            ),
          ],
          {
            type: cover.getAttribute("content-type")!,
          }
        )
      : null,
  }
}
