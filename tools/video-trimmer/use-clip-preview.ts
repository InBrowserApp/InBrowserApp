import { useCallback, useEffect, useRef, type RefObject } from "react"
import type { ClipRange } from "./types"

export function useClipPreview(video: RefObject<HTMLVideoElement | null>) {
  const end = useRef<number | null>(null)
  const frame = useRef(0)

  const stop = useCallback(() => {
    end.current = null
    cancelAnimationFrame(frame.current)
  }, [])
  useEffect(() => stop, [stop])

  function checkEnd() {
    const element = video.current!
    const boundary = end.current
    if (boundary !== null && element.currentTime >= boundary) {
      stop()
      element.pause()
      element.currentTime = boundary
    }
  }

  function play(range: ClipRange) {
    const element = video.current!
    stop()
    element.currentTime = range.start
    end.current = range.end
    const tick = () => {
      checkEnd()
      if (end.current !== null) frame.current = requestAnimationFrame(tick)
    }
    void element.play().catch(stop)
    frame.current = requestAnimationFrame(tick)
  }

  function scrub(time?: number) {
    stop()
    const element = video.current!
    element.pause()
    if (time !== undefined) element.currentTime = time
  }

  return { checkEnd, play, scrub, stop }
}
