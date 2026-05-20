/* v8 ignore start -- Canvas implementations are browser/worker APIs. */
type BitmapCanvas = Readonly<{
  canvas: HTMLCanvasElement | OffscreenCanvas
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
}>

function createBitmapCanvas(width: number, height: number): BitmapCanvas {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext("2d", { willReadFrequently: true })

    if (!context) {
      throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
    }

    return { canvas, context }
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas")

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d", { willReadFrequently: true })

    if (!context) {
      throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
    }

    return { canvas, context }
  }

  throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
}

async function canvasToPngBytes(canvas: HTMLCanvasElement | OffscreenCanvas) {
  if ("convertToBlob" in canvas) {
    const blob = await canvas.convertToBlob({ type: "image/png" })

    return new Uint8Array(await blob.arrayBuffer())
  }

  const htmlCanvas = canvas as HTMLCanvasElement
  const blob = await new Promise<Blob>((resolve, reject) => {
    htmlCanvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        reject(new Error("CANVAS_CONTEXT_UNAVAILABLE"))
        return
      }

      resolve(pngBlob)
    }, "image/png")
  })

  return new Uint8Array(await blob.arrayBuffer())
}
/* v8 ignore stop */

export { canvasToPngBytes, createBitmapCanvas }
