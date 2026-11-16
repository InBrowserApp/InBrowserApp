export const ACCEPT = "image/png,image/jpeg,image/webp"
const MIME_TYPES = ACCEPT.split(",")
const MB = 1024 * 1024

export function validFiles(files: readonly File[]) {
  return (
    files.length <= 50 &&
    files.every(
      (file) => MIME_TYPES.includes(file.type) && file.size <= 20 * MB
    ) &&
    files.reduce((total, file) => total + file.size, 0) <= 100 * MB
  )
}

export function assertDimensions(width: number, height: number) {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > 16384 ||
    height > 16384 ||
    width * height > 24_000_000
  ) {
    throw new Error("IMAGE_DIMENSIONS")
  }
}

export function outputName(name: string, mime: string, used: Set<string>) {
  const extension =
    mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png"
  const base =
    name
      .replace(/\.[^.]*$/, "")
      .replace(/[/\\\p{Cc}]/gu, "_")
      .trim()
      .slice(0, 120) || "image"
  let result = `${base}-watermarked.${extension}`
  let suffix = 2
  while (used.has(result.toLowerCase())) {
    result = `${base}-watermarked-${suffix++}.${extension}`
  }
  used.add(result.toLowerCase())
  return result
}
