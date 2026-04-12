/* v8 ignore start -- browser-only binary assembly used through the generator */
const MAX_SIZE = 256
const MAX_FILES = 65_536
const FILE_HEADER_SIZE = 6
const IMAGE_HEADER_SIZE = 16
const ICO_MIME = "image/x-icon"

type BinaryLike = ArrayBuffer | Blob

type ConvertInputItem = Readonly<{
  png: BinaryLike
  bpp?: number
  ignoreSize?: number
}>

class PngIcoConverter {
  async convertToBlobAsync(
    inputs: readonly ConvertInputItem[],
    mime = ICO_MIME
  ) {
    const bytes = await this.convertAsync(inputs)

    return new Blob([bytes], {
      type: mime,
    })
  }

  async convertAsync(inputs: readonly ConvertInputItem[]) {
    if (inputs.length > MAX_FILES) {
      throw new Error("TOO_MANY_FILES")
    }

    const headersLength = FILE_HEADER_SIZE + IMAGE_HEADER_SIZE * inputs.length
    const totalLength = headersLength + this.sumInputLength(inputs)
    const bytes = new Uint8Array(totalLength)

    bytes.set([0, 0, 1, 0, ...this.to2Bytes(inputs.length)], 0)

    let imageOffset = headersLength

    for (const [index, input] of inputs.entries()) {
      const headerOffset = FILE_HEADER_SIZE + IMAGE_HEADER_SIZE * index
      const blob = this.toBlob(input.png)
      const image = await this.loadImageAsync(blob)
      const width = image.naturalWidth
      const height = image.naturalHeight

      if (!input.ignoreSize && (width > MAX_SIZE || height > MAX_SIZE)) {
        throw new Error("INVALID_SIZE")
      }

      bytes.set(
        [
          width > MAX_SIZE ? 0 : width,
          height > MAX_SIZE ? 0 : height,
          0,
          0,
          0,
          0,
          ...(input.bpp ? this.to2Bytes(input.bpp) : [0, 0]),
          ...this.to4Bytes(blob.size),
          ...this.to4Bytes(imageOffset),
        ],
        headerOffset
      )

      const buffer =
        input.png instanceof ArrayBuffer
          ? input.png
          : await input.png.arrayBuffer()
      bytes.set(new Uint8Array(buffer), imageOffset)
      imageOffset += blob.size
    }

    return bytes
  }

  protected loadImageAsync(png: Blob) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(png)
      const image = new Image()

      image.onload = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(image)
      }

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error("INVALID_IMAGE"))
      }

      image.src = objectUrl
    })
  }

  protected toBlob(input: BinaryLike, type = "image/png") {
    return input instanceof Blob
      ? input
      : new Blob([input], {
          type,
        })
  }

  protected to2Bytes(value: number) {
    return [value & 255, (value >> 8) & 255]
  }

  protected to4Bytes(value: number) {
    return [
      value & 255,
      (value >> 8) & 255,
      (value >> 16) & 255,
      (value >> 24) & 255,
    ]
  }

  protected sumInputLength(inputs: readonly ConvertInputItem[]) {
    return inputs.reduce((total, input) => {
      return (
        total +
        (input.png instanceof Blob ? input.png.size : input.png.byteLength)
      )
    }, 0)
  }
}

export { PngIcoConverter }
/* v8 ignore stop */
