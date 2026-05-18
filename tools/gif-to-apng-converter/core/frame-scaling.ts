/* v8 ignore start -- canvas scaling is exercised by browser integration */
function scaleFramesIfNeeded(
  frames: readonly Uint8ClampedArray[],
  width: number,
  height: number,
  outputWidth: number,
  outputHeight: number
) {
  if (width === outputWidth && height === outputHeight) {
    return frames.map((frame) => new Uint8ClampedArray(frame).buffer)
  }

  const sourceCanvas = document.createElement("canvas")
  sourceCanvas.width = width
  sourceCanvas.height = height

  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  })

  if (!sourceContext) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  const targetCanvas = document.createElement("canvas")
  targetCanvas.width = outputWidth
  targetCanvas.height = outputHeight

  const targetContext = targetCanvas.getContext("2d", {
    willReadFrequently: true,
  })

  if (!targetContext) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  targetContext.imageSmoothingEnabled = true
  targetContext.imageSmoothingQuality = "high"

  return frames.map((frame) => {
    sourceContext.putImageData(
      new ImageData(new Uint8ClampedArray(frame), width, height),
      0,
      0
    )
    targetContext.clearRect(0, 0, outputWidth, outputHeight)
    targetContext.drawImage(sourceCanvas, 0, 0, outputWidth, outputHeight)

    return targetContext.getImageData(0, 0, outputWidth, outputHeight).data
      .buffer
  })
}
/* v8 ignore stop */

export { scaleFramesIfNeeded }
