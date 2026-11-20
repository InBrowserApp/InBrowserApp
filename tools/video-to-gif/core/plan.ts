import { MAX_EDGE } from "@workspace/raster-image/animation-size"

const MAX_FRAMES = 300
const MAX_TOTAL_PIXELS = 120_000_000

export type Settings = {
  start: string
  end: string
  fps: number
  width: string
}

export type VideoInfo = {
  duration: number
  width: number
  height: number
  maxWidth: number
}

export function milliseconds(seconds: string) {
  return seconds.trim() === "" ? NaN : Math.round(Number(seconds) * 1000)
}

export type GifPlan = {
  width: number
  height: number
  frames: { time: number; delay: number }[]
  duration: number
}

export function planGif(
  settings: Settings,
  video: VideoInfo
): GifPlan | { error: "rangeError" | "widthError" | "workLimit" } {
  const start = milliseconds(settings.start)
  const end = milliseconds(settings.end)
  if (!(start >= 0 && end > start && end <= video.duration)) {
    return { error: "rangeError" }
  }
  const width = Number(settings.width)
  if (!Number.isInteger(width) || width < 1 || width > video.maxWidth) {
    return { error: "widthError" }
  }
  const height = Math.min(
    MAX_EDGE,
    Math.max(1, Math.round((width / video.width) * video.height))
  )
  const duration = end - start
  const interval = 1000 / settings.fps
  const count = Math.ceil((duration * settings.fps) / 1000)
  if (count > MAX_FRAMES || count * width * height > MAX_TOTAL_PIXELS) {
    return { error: "workLimit" }
  }

  const frames = Array.from({ length: count }, (_, index) => {
    const offset = index * interval
    // GIF delays are whole centiseconds. Round boundaries so fractional
    // frame rates do not accumulate a timing error over the clip.
    const delay =
      10 *
      (Math.round(Math.min(duration, offset + interval) / 10) -
        Math.round(offset / 10))
    return { time: (start + offset) / 1000, delay: Math.max(20, delay) }
  })

  return { width, height, frames, duration }
}
