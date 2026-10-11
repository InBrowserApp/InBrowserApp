export type Resource = { bytes: Uint8Array; mime: string }

export function resource(
  bytes: Uint8Array | undefined,
  extension: string
): Resource {
  const types: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    svg: "image/svg+xml",
  }
  const mime = types[extension.toLowerCase()]
  if (!bytes?.length || !mime) throw new Error("unsupported")
  return { bytes, mime }
}
