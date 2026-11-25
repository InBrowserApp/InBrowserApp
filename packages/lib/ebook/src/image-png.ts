export async function imagePng(url: string, signal: AbortSignal) {
  signal.throwIfAborted()
  const image = new Image()
  const canvas = document.createElement("canvas")
  try {
    image.src = url
    await image.decode()
    signal.throwIfAborted()
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d")
    if (!context) throw new Error("incomplete")
    context.drawImage(image, 0, 0)
    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error("incomplete")),
        "image/png"
      )
    })
    signal.throwIfAborted()
    return png
  } finally {
    canvas.width = canvas.height = 0
    image.removeAttribute("src")
  }
}
