import type { CoverType } from "./types"

const signatures = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
} satisfies Record<CoverType, number[]>

export async function prepareCover(file: Blob, existingType: string | null) {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const type = Object.keys(signatures).find((key) =>
    signatures[key as CoverType].every((byte, index) => header[index] === byte)
  ) as CoverType | undefined
  if (!type) throw new Error("invalid")

  const blob = file.slice(0, file.size, type)
  const url = URL.createObjectURL(blob)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    if (
      existingType === type ||
      (existingType !== "image/png" && existingType !== "image/jpeg")
    )
      return blob

    // Keep the original image path and type so existing cover pages use the new art.
    const canvas = document.createElement("canvas")
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d", {
      alpha: existingType === "image/png",
    })
    if (!context) throw new Error("invalid")
    if (existingType === "image/jpeg") {
      context.fillStyle = "#fff"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(image, 0, 0)
    const converted = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, existingType, 0.95)
    )
    if (!converted || converted.type !== existingType)
      throw new Error("invalid")
    return converted
  } finally {
    URL.revokeObjectURL(url)
  }
}
