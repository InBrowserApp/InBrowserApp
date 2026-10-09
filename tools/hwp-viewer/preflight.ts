import * as CFB from "cfb"
import { unzipSync } from "fflate"
import { SaxesParser } from "saxes"

const signature = new TextEncoder().encode("HWP Document File")
const cfbSignature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]
const manifestNamespace = "urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"

export function preflight(bytes: Uint8Array) {
  const prefix = new TextDecoder().decode(bytes.subarray(0, 32))
  if (prefix.startsWith("HWP Document File V")) throw new Error("legacy")
  if (cfbSignature.every((byte, index) => bytes[index] === byte)) {
    const container = CFB.read(bytes, { type: "array" })
    const entry = CFB.find(container, "FileHeader")
    const header = entry?.content && new Uint8Array(entry.content)
    if (
      !header ||
      header.length < 256 ||
      !signature.every((byte, index) => header[index] === byte)
    )
      throw new Error("invalid")
    const flags = new DataView(header.buffer, header.byteOffset).getUint32(
      36,
      true
    )
    // HWP 5 specification, table 3: opening encryption, DRM, certificate
    // encryption and certificate DRM. Signature-only bits remain readable.
    if (flags & (0x02 | 0x10 | 0x100 | 0x400)) throw new Error("protected")
    if (flags & 0x04) throw new Error("distribution")
    if (header[35] !== 5 || header[34]! > 1) throw new Error("legacy")
    return
  }
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error("invalid")
  const files = unzipSync(bytes, {
    filter: (entry) =>
      ["mimetype", "META-INF/manifest.xml", "Contents/content.hpf"].includes(
        entry.name
      ),
  })
  const mime = files.mimetype && new TextDecoder().decode(files.mimetype).trim()
  if (mime !== "application/hwp+zip" || !files["Contents/content.hpf"])
    throw new Error("invalid")
  if (files["META-INF/manifest.xml"]) {
    const parser = new SaxesParser({ xmlns: true })
    parser.on("doctype", () => {
      throw new Error("invalid")
    })
    parser.on("opentag", (node) => {
      if (node.uri === manifestNamespace && node.local === "encryption-data")
        throw new Error("protected")
    })
    parser
      .write(
        new TextDecoder("utf-8", { fatal: true }).decode(
          files["META-INF/manifest.xml"]
        )
      )
      .close()
  }
}
