import type { ImageInfo } from "./types"

export function pngFilename(name: string, info: ImageInfo, index: number) {
  const extension = name.lastIndexOf(".")
  const basename = (extension < 0 ? name : name.slice(0, extension))
    // Remove control characters that cannot safely appear in a download filename.
    // oxlint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .trim()
  let start = 0
  let end = basename.length
  while (start < end && basename[start] === ".") start++
  while (end > start && basename[end - 1] === ".") end--
  const stem = basename.slice(start, end) || "image"
  const suffix = info.poster
    ? "-poster"
    : info.count > 1
      ? `-${info.kind}-${index + 1}`
      : ""
  return `${stem}${suffix}.png`
}
