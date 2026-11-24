import { SaxesParser } from "saxes"

function parseXml(text: string, rootName: string): XMLDocument {
  const xml = document.implementation.createDocument(null, "")
  const parser = new SaxesParser({ xmlns: true })
  let parent: Element | null = null

  parser.on("opentag", (tag) => {
    const element = xml.createElementNS(tag.uri || null, tag.name)
    for (const attribute of Object.values(tag.attributes)) {
      element.setAttributeNS(
        attribute.uri || null,
        attribute.name,
        attribute.value
      )
    }
    const container = parent ?? xml
    container.appendChild(element)
    parent = element
  })
  parser.on("closetag", () => {
    parent = parent?.parentElement ?? null
  })
  parser.on("text", (text) => {
    parent?.appendChild(xml.createTextNode(text))
  })
  parser.on("cdata", (text) => {
    parent?.appendChild(xml.createCDATASection(text))
  })
  parser.on("error", () => {
    throw new Error("Invalid XML")
  })
  parser.write(text).close()

  if (xml.documentElement?.localName !== rootName)
    throw new Error("Invalid XML")
  return xml
}

export { parseXml }
