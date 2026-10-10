import { unzipSync } from "fflate"
import { DocxDocument } from "@silurus/ooxml/docx"
import { failure } from "./errors"
import { formatDocument } from "./format"
import type { Request, Result } from "./types"

function validateArchive(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  if (
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
      (byte, i) => bytes[i] === byte
    )
  )
    throw new Error("protected")
  if (
    bytes[0] !== 0x50 ||
    bytes[1] !== 0x4b ||
    bytes[2] !== 3 ||
    bytes[3] !== 4
  )
    throw new Error("invalid")
  const required = new Set(["[Content_Types].xml", "word/document.xml"])
  unzipSync(bytes, {
    filter: ({ name }) => {
      required.delete(name)
      return false
    },
  })
  if (required.size) throw new Error("invalid")
}

export async function convert({ source, labels }: Request): Promise<Result> {
  let document: DocxDocument | undefined
  try {
    if ("model" in source) return { text: formatDocument(source.model, labels) }
    if (!/\.(docx|docm|dotx|dotm)$/i.test(source.file.name))
      throw new Error("invalid")
    const data = await source.file.arrayBuffer()
    validateArchive(data)
    document = await DocxDocument.load(data, {
      useGoogleFonts: false,
      mode: "main",
      resourceLimits: {
        maxArchiveEntryBytes: null,
        maxTotalInflatedBytes: null,
        maxArchiveEntries: null,
      },
    })
    return { text: formatDocument(document.document, labels) }
  } catch (reason) {
    return { error: failure(reason) }
  } finally {
    document?.destroy()
  }
}
