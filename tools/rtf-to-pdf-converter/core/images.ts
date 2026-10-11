import { ConversionError, failure } from "./errors"

export type Picture = {
  format?: "png" | "jpeg"
  chunks: Uint8Array[]
  nibble?: number
}

export function pictureText(picture: Picture, bytes: Uint8Array) {
  const output = new Uint8Array(Math.ceil(bytes.length / 2))
  let length = 0
  for (const code of bytes) {
    if ([9, 10, 13, 32].includes(code)) continue
    const digit =
      code >= 48 && code <= 57
        ? code - 48
        : code >= 65 && code <= 70
          ? code - 55
          : code >= 97 && code <= 102
            ? code - 87
            : -1
    if (digit < 0) throw new ConversionError("invalid")
    if (picture.nibble === undefined) picture.nibble = digit
    else {
      output[length++] = picture.nibble * 16 + digit
      picture.nibble = undefined
    }
  }
  picture.chunks.push(output.subarray(0, length))
}

export function finishPicture(picture: Picture) {
  if (picture.nibble !== undefined) throw new ConversionError("invalid")
  const size = picture.chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of picture.chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  const signature =
    picture.format === "png"
      ? [137, 80, 78, 71, 13, 10, 26, 10]
      : [255, 216, 255]
  if (
    !picture.format ||
    !signature.every((value, index) => bytes[index] === value)
  )
    throw new ConversionError("unsupported")
  return new Blob([bytes], { type: `image/${picture.format}` })
}

export async function checkImages(images: Blob[]) {
  for (const image of images) {
    try {
      const bitmap = await createImageBitmap(image)
      bitmap.close()
    } catch (error) {
      const problem = failure(error)
      throw problem.code === "resource"
        ? problem
        : new ConversionError("unsupported")
    }
  }
}
