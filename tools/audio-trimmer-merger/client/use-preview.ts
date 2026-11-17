import { useEffect, useRef, useState } from "react"
import type { AudioClip } from "../types"

export function usePreview(onError: () => void) {
  const context = useRef<AudioContext | null>(null)
  const source = useRef<AudioBufferSourceNode | null>(null)
  const revision = useRef(0)
  const [playing, setPlaying] = useState<string | null>(null)

  function stop() {
    revision.current++
    if (source.current) source.current.onended = null
    source.current?.stop()
    source.current?.disconnect()
    source.current = null
    setPlaying(null)
  }

  async function play(clip: AudioClip) {
    stop()
    const current = revision.current
    try {
      context.current ??= new AudioContext()
      const audio = context.current
      await audio.resume()
      if (current !== revision.current) return
      const node = audio.createBufferSource()
      node.buffer = clip.buffer
      node.connect(audio.destination)
      node.onended = () => {
        node.disconnect()
        if (source.current === node) {
          source.current = null
          setPlaying(null)
        }
      }
      source.current = node
      node.start(0, clip.start, clip.end - clip.start)
      setPlaying(clip.id)
    } catch {
      if (current === revision.current) {
        stop()
        onError()
      }
    }
  }

  useEffect(
    () => () => {
      revision.current++
      if (source.current) source.current.onended = null
      source.current?.stop()
      source.current?.disconnect()
      void context.current?.close()
    },
    []
  )

  return { playing, play, stop }
}
