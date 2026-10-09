import { strToU8, zipSync } from "fflate"

export const namespaces = `xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:draw:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:xlink="http://www.w3.org/1999/xlink"`
export function fixture(
  body: string,
  extras: Record<string, string | Uint8Array> = {},
  automatic = ""
) {
  const entries = {
    mimetype: "application/vnd.oasis.opendocument.text",
    "content.xml": `<office:document-content ${namespaces}><office:automatic-styles>${automatic}</office:automatic-styles><office:body><office:text>${body}</office:text></office:body></office:document-content>`,
    ...extras,
  }
  const bytes = zipSync(
    Object.fromEntries(
      Object.entries(entries).map(([key, value]) => [
        key,
        typeof value === "string" ? strToU8(value) : value,
      ])
    )
  )
  return bytes.buffer as ArrayBuffer
}
