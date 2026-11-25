import { drawingFonts } from "@workspace/dxf-drawing/fonts"
import { readVectorDrawing } from "@workspace/dxf-drawing/reader"
import type { VectorDrawing } from "@workspace/dxf-drawing/vector"

export type DrawingResult =
  | { kind: "ready"; drawing: VectorDrawing }
  | { kind: "binary" | "empty" }

self.onmessage = async ({
  data,
}: MessageEvent<{ file: File; lang: string }>) => {
  try {
    const drawing = await readVectorDrawing(
      data.file,
      await drawingFonts(data.lang)
    )
    const output: DrawingResult = drawing.layers.length
      ? { kind: "ready", drawing }
      : { kind: "empty" }
    self.postMessage(output)
  } catch (error) {
    self.postMessage(
      error instanceof Error && error.cause === "binary"
        ? { kind: "binary" }
        : null
    )
  }
}
