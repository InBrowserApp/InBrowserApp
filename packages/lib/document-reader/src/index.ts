import { unzipSync } from "fflate"

export const officeLoadOptions = {
  useGoogleFonts: false,
  mode: "main" as const,
  workerTimeoutMs: 30_000,
  resourceLimits: {
    maxArchiveEntryBytes: 32 * 1024 * 1024,
    maxTotalInflatedBytes: 128 * 1024 * 1024,
    maxArchiveEntries: 10_000,
  },
}
export const imageResources = {
  decodedByteBudget: 64 * 1024 * 1024,
  strategy: "strict" as const,
}
// Dimensions are CSS pixels at 100% zoom with a rendering DPR of 1.
export function maximumPageZoom(width: number, height: number): number {
  if (!Number.isFinite(width * height) || width <= 0 || height <= 0)
    throw new Error("TOO_LARGE")
  const maximum = Math.min(
    4,
    8192 / width,
    8192 / height,
    Math.sqrt(16_000_000 / width / height)
  )
  if (maximum < 0.25) throw new Error("TOO_LARGE")
  return maximum
}
export function isDocumentLimitError(reason: unknown): boolean {
  return (
    reason instanceof Error &&
    (reason.message === "TOO_LARGE" ||
      ("code" in reason &&
        (reason.code === "ooxml-resource-limit" ||
          reason.code === "ooxml-decoded-image-limit")))
  )
}

// Inspect directory entries without inflating any file contents. Some engines
// accept text or other containers as a fallback, but these viewers only accept
// their advertised modern Office format.
export function assertOfficeArchive(
  data: ArrayBuffer,
  format: "docx" | "pptx" | "xlsx"
) {
  const bytes = new Uint8Array(data)
  if (
    bytes[0] !== 0x50 ||
    bytes[1] !== 0x4b ||
    bytes[2] !== 3 ||
    bytes[3] !== 4
  )
    throw new Error("INVALID")
  const required = new Set([
    "[Content_Types].xml",
    {
      docx: "word/document.xml",
      pptx: "ppt/presentation.xml",
      xlsx: "xl/workbook.xml",
    }[format],
  ])
  let entries = 0
  let inflatedBytes = 0
  const limits = officeLoadOptions.resourceLimits
  unzipSync(bytes, {
    filter: (entry) => {
      entries++
      inflatedBytes += entry.originalSize
      if (
        entries > limits.maxArchiveEntries ||
        entry.originalSize > limits.maxArchiveEntryBytes ||
        inflatedBytes > limits.maxTotalInflatedBytes
      )
        throw new Error("TOO_LARGE")
      required.delete(entry.name)
      return false
    },
  })
  if (required.size) throw new Error("INVALID")
}
