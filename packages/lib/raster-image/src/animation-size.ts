export const MAX_EDGE = 1280

export function animationSize(
  frames: readonly { width: number; height: number }[]
) {
  let width = 0
  let height = 0
  for (const frame of frames) {
    width = Math.max(width, frame.width)
    height = Math.max(height, frame.height)
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  }
}

export function frameRect(
  frame: { width: number; height: number },
  canvas: { width: number; height: number },
  scale: number
) {
  const width = Math.max(1, Math.round(frame.width * scale))
  const height = Math.max(1, Math.round(frame.height * scale))
  return {
    width,
    height,
    x: Math.floor((canvas.width - width) / 2),
    y: Math.floor((canvas.height - height) / 2),
  }
}
