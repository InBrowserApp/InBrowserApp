import type { BookDetails } from "./types"

const dc = "http://purl.org/dc/elements/1.1/"
const opf = "http://www.idpf.org/2007/opf"

const fields = {
  title: "title",
  authors: "creator",
  language: "language",
  publisher: "publisher",
  subjects: "subject",
  description: "description",
} satisfies Record<keyof BookDetails, string>

export function parseXml(source: string) {
  const xml = new DOMParser().parseFromString(source, "application/xml")
  if (xml.querySelector("parsererror")) throw new Error("invalid")
  return xml
}

function words(value: string | null): string[] {
  return (value ?? "").match(/\S+/g) ?? []
}

export function packageDocument(source: string) {
  const xml = parseXml(source)
  const root = xml.documentElement
  const metadata = Array.from(root.children).find(
    (element) => element.localName === "metadata"
  )
  const manifest = Array.from(root.children).find(
    (element) => element.localName === "manifest"
  )
  const version = root.getAttribute("version") ?? ""
  if (
    root.localName !== "package" ||
    !metadata ||
    !manifest ||
    !/^[23]\./.test(version)
  )
    throw new Error("invalid")
  const epub3 = version.startsWith("3.")
  const metas = Array.from(metadata.children).filter(
    (element) => element.localName === "meta"
  )
  const items = Array.from(manifest.children)
  const coverItems = items.filter((item) =>
    words(item.getAttribute("properties")).includes("cover-image")
  )
  const legacyCover = metas.find(
    (meta) => meta.getAttribute("name") === "cover"
  )
  const coverItem =
    coverItems[0] ??
    items.find((item) => item.id === legacyCover?.getAttribute("content"))

  function refinements(element: Element, property?: string) {
    return metas.filter(
      (meta) =>
        element.id &&
        meta.getAttribute("refines") === "#" + element.id &&
        (!property || meta.getAttribute("property") === property)
    )
  }

  function isAuthor(element: Element) {
    const roles = refinements(element, "role").map((meta) =>
      meta.textContent?.trim()
    )
    const role = element.getAttributeNS(opf, "role")
    if (role) roles.push(role)
    return !roles.length || roles.includes("aut")
  }

  function elements(field: keyof BookDetails) {
    const nodes = Array.from(metadata!.children).filter(
      (element) =>
        element.namespaceURI === dc && element.localName === fields[field]
    )
    if (field === "authors") return nodes.filter(isAuthor)
    if (field === "subjects") return nodes
    if (field === "title") {
      const main = nodes.find((node) =>
        refinements(node, "title-type").some(
          (meta) => meta.textContent?.trim() === "main"
        )
      )
      if (main) return [main]
    }
    return nodes.slice(0, 1)
  }

  function value(element: Element) {
    return element.textContent?.trim() ?? ""
  }

  function setValues(field: keyof BookDetails, values: string[]) {
    const nodes = elements(field)
    if (
      values.length === nodes.length &&
      nodes.every((node, i) => value(node) === values[i])
    )
      return

    // Keep the original IDs and refinements for authors and subjects that survive edits.
    const remaining = new Set(nodes)
    const matches = values.map((text) => {
      const node = Array.from(remaining).find(
        (candidate) => value(candidate) === text
      )
      if (node) remaining.delete(node)
      return node
    })
    const anchor = nodes.at(-1)?.nextSibling ?? null
    for (const [i, text] of values.entries()) {
      const node =
        matches[i] ??
        remaining.values().next().value ??
        xml.createElementNS(dc, "dc:" + fields[field])
      remaining.delete(node)
      if (value(node) !== text) {
        node.textContent = text
        node.removeAttributeNS(opf, "file-as")
        for (const meta of refinements(node, "file-as")) meta.remove()
      }
      metadata!.insertBefore(node, anchor)
    }
    for (const node of remaining) {
      for (const meta of refinements(node)) meta.remove()
      node.remove()
    }
  }

  return {
    coverItem,
    items,
    guideCover: epub3
      ? null
      : Array.from(root.getElementsByTagNameNS(opf, "reference"))
          .find((element) => element.getAttribute("type") === "cover")
          ?.getAttribute("href"),
    details() {
      const read = (field: keyof BookDetails) =>
        elements(field).map(value).filter(Boolean).join("\n")
      return {
        title: read("title"),
        authors: read("authors"),
        language: read("language"),
        publisher: read("publisher"),
        subjects: read("subjects"),
        description: read("description"),
      }
    },
    updateDetails(details: BookDetails) {
      const old = this.details()
      for (const field of Object.keys(fields) as (keyof BookDetails)[]) {
        const multiple = field === "authors" || field === "subjects"
        const values = (
          multiple ? details[field].split(/\r?\n/) : [details[field]]
        )
          .map((text) => text.trim())
          .filter(Boolean)
        if (values.join("\n") !== old[field]) setValues(field, values)
      }
    },
    setCover(href: string, type: string, item?: Element) {
      if (!item) {
        const ids = new Set(
          Array.from(root.querySelectorAll("[id]"), (element) => element.id)
        )
        let id = "cover-image"
        for (let i = 2; ids.has(id); i++) id = "cover-image-" + i
        item = xml.createElementNS(manifest.namespaceURI, "item")
        item.id = id
        item.setAttribute("href", href)
        item.setAttribute("media-type", type)
        manifest.append(item)
      }
      for (const previous of coverItems) {
        if (previous === item) continue
        const properties = words(previous.getAttribute("properties")).filter(
          (property) => property !== "cover-image"
        )
        if (properties.length)
          previous.setAttribute("properties", properties.join(" "))
        else previous.removeAttribute("properties")
      }
      if (epub3) {
        const properties = new Set(words(item.getAttribute("properties")))
        properties.add("cover-image")
        item.setAttribute("properties", Array.from(properties).join(" "))
      }
      if (!epub3 || legacyCover) {
        const meta =
          legacyCover ?? xml.createElementNS(metadata.namespaceURI, "meta")
        meta.setAttribute("name", "cover")
        meta.setAttribute("content", item.id)
        if (!legacyCover) metadata.append(meta)
      }
    },
    serialize() {
      if (epub3) {
        const modified =
          metas.find(
            (meta) => meta.getAttribute("property") === "dcterms:modified"
          ) ?? xml.createElementNS(metadata.namespaceURI, "meta")
        modified.setAttribute("property", "dcterms:modified")
        modified.textContent = new Date()
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z")
        if (!modified.parentNode) metadata.append(modified)
      }
      return new XMLSerializer().serializeToString(xml)
    },
  }
}
