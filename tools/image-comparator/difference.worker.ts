import { comparePixels } from "./core/compare-pixels"

type Sources = { before: ImageBitmap; after: ImageBitmap }
export type DifferenceRequest = Sources | number
export type DifferenceReply =
  | { type: "result"; tolerance: number; bitmap: ImageBitmap; changed: number }
  | { type: "error" }

function prepare({ before, after }: Sources) {
  try {
    const canvas = new OffscreenCanvas(before.width, before.height)
    const { width, height } = canvas
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) throw new Error("Canvas 2D unavailable")

    context.drawImage(before, 0, 0)
    const a = context.getImageData(0, 0, width, height).data
    context.clearRect(0, 0, width, height)
    context.drawImage(after, 0, 0)
    const b = context.getImageData(0, 0, width, height).data
    const output = context.createImageData(width, height)

    return (tolerance: number) => {
      const changed = comparePixels(a, b, output.data, tolerance)
      context.putImageData(output, 0, 0)
      const bitmap = canvas.transferToImageBitmap()
      const reply: DifferenceReply = {
        type: "result",
        tolerance,
        bitmap,
        changed,
      }
      self.postMessage(reply, { transfer: [bitmap] })
    }
  } finally {
    before.close()
    after.close()
  }
}

let compare: ReturnType<typeof prepare> | undefined

self.onmessage = ({ data }: MessageEvent<DifferenceRequest>) => {
  try {
    if (typeof data === "number") compare?.(data)
    else compare = prepare(data)
  } catch {
    const reply: DifferenceReply = { type: "error" }
    self.postMessage(reply)
  }
}
