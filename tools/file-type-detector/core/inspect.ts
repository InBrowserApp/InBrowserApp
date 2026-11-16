import { fileTypeFromBuffer } from "file-type"
import mimeDatabase from "mime-db"
import type { ExtensionStatus, Inspection } from "../types"

export const SAMPLE_BYTES = 64 * 1024
const PREVIEW_BYTES = 256

// A generic container signature cannot rule out one of its derived formats.
const CONTAINER_EXTENSIONS: Record<string, readonly string[]> = {
  zip: [
    "docx",
    "docm",
    "dotx",
    "dotm",
    "xlsx",
    "xlsm",
    "xltx",
    "xltm",
    "xlsb",
    "pptx",
    "pptm",
    "potx",
    "potm",
    "ppsx",
    "ppsm",
    "odt",
    "ods",
    "odp",
    "odg",
    "ott",
    "ots",
    "otp",
    "epub",
    "jar",
    "war",
    "ear",
    "apk",
    "aab",
    "xpi",
    "vsix",
    "cbz",
    "3mf",
    "kmz",
    "pages",
    "numbers",
    "key",
  ],
  cfb: ["doc", "xls", "ppt", "msg", "msi", "msp", "pub", "vsd", "wps"],
  ogg: ["oga", "ogv", "opus", "spx"],
  mp4: ["m4a", "m4b", "m4v", "heic", "heif", "avif"],
  gz: ["tgz", "svgz"],
  xml: ["svg", "xhtml", "rss", "atom", "xslt", "kml", "gpx", "plist"],
  tif: ["cr2", "nef", "arw", "dng", "orf", "rw2"],
}

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".")
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ""
}

export function formatHex(bytes: Uint8Array): string {
  const rows: string[] = []
  for (
    let offset = 0;
    offset < Math.min(bytes.length, PREVIEW_BYTES);
    offset += 16
  ) {
    const row = bytes.subarray(offset, Math.min(offset + 16, PREVIEW_BYTES))
    const hex = Array.from(row, (byte) =>
      byte.toString(16).padStart(2, "0").toUpperCase()
    ).join(" ")
    const ascii = Array.from(row, (byte) =>
      byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "."
    ).join("")
    rows.push(
      `${offset.toString(16).padStart(8, "0").toUpperCase()}  ${hex.padEnd(47)}  |${ascii}|`
    )
  }
  return rows.join("\n")
}

export function compareExtension(
  extension: string,
  detected: Inspection["detected"],
  extensions: readonly string[]
): ExtensionStatus {
  if (!detected) return "unknown"
  if (!extension) return "missing"
  if (extensions.includes(extension)) return "match"
  if (CONTAINER_EXTENSIONS[detected.ext]?.includes(extension))
    return "container"
  return "mismatch"
}

export async function inspectFile(file: File): Promise<Inspection> {
  const bytes = new Uint8Array(await file.slice(0, SAMPLE_BYTES).arrayBuffer())
  let detected: Inspection["detected"] = null
  try {
    detected = (await fileTypeFromBuffer(bytes)) ?? null
  } catch {
    // Incomplete or malformed headers can make the parser reject the sample.
    // Preserve the bytes for inspection without claiming a format or mismatch.
  }
  const extensions = detected
    ? [
        ...new Set([
          detected.ext,
          ...(mimeDatabase[detected.mime]?.extensions ?? []),
        ]),
      ]
    : []
  const extension = getExtension(file.name)
  return {
    fileName: file.name,
    fileSize: file.size,
    browserMime: file.type,
    extension,
    detected,
    extensions,
    status:
      bytes.length === 0
        ? "empty"
        : compareExtension(extension, detected, extensions),
    hex: formatHex(bytes),
  }
}
