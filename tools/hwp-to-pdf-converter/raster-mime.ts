// Check the declared raster type before handing bytes to a browser decoder.
// SVG must always take the sanitization path, even if mislabeled as a raster.
export function checkRaster(bytes: Uint8Array, mime: string) {
  const signatures: Record<string, number[]> = {
    "image/png": [137, 80, 78, 71, 13, 10, 26, 10],
    "image/jpeg": [255, 216, 255],
    "image/gif": [71, 73, 70, 56],
    "image/bmp": [66, 77],
    "image/webp": [82, 73, 70, 70],
  }
  const signature = signatures[mime]
  if (!signature || !signature.every((value, index) => bytes[index] === value))
    throw new Error("unsupported")
  if (
    mime === "image/webp" &&
    ![87, 69, 66, 80].every((value, index) => bytes[index + 8] === value)
  )
    throw new Error("unsupported")
}
