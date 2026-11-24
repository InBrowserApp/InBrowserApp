function parseXml(text: string, rootName: string) {
  const document = new DOMParser().parseFromString(text, "application/xml")
  if (
    document.documentElement.localName !== rootName ||
    document.getElementsByTagNameNS("*", "parsererror").length
  )
    throw new Error("Invalid XML")
  return document
}

export { parseXml }
