import { useEffect, useRef, useState } from "react"
import { frameRange, SAMPLE_RATE, validRange, waveform } from "../core/audio"
import { usePreview } from "./use-preview"
import type { AudioClip, AudioEditorMessages } from "../types"

export function useAudioEditor(messages: AudioEditorMessages) {
  const [clips, setClips] = useState<AudioClip[]>([])
  const [removed, setRemoved] = useState<{
    clip: AudioClip
    index: number
  } | null>(null)
  const [busy, setBusy] = useState<"reading" | "exporting" | null>(null)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ url: string } | null>(null)
  const [name, setName] = useState("audio")
  const [smooth, setSmooth] = useState(false)
  const worker = useRef<Worker | null>(null)
  const mounted = useRef(true)
  const locked = useRef(false)
  const preview = usePreview(() => setError(messages.playError))
  const valid =
    clips.length > 0 &&
    clips.every((clip) =>
      validRange(clip.start, clip.end, clip.buffer.duration)
    )
  const duration = clips.reduce((total, clip) => {
    if (!validRange(clip.start, clip.end, clip.buffer.duration)) return total
    const [start, end] = frameRange(clip.start, clip.end, clip.buffer.length)
    return total + (end - start) / SAMPLE_RATE
  }, 0)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      worker.current?.terminate()
    }
  }, [])
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url)
    },
    [result]
  )

  function invalidate() {
    preview.stop()
    setResult(null)
    setError("")
  }

  async function addFiles(files: File[]) {
    if (locked.current || !files.length) return
    locked.current = true
    invalidate()
    setBusy("reading")
    const added: AudioClip[] = []
    const errors: string[] = []
    try {
      if (typeof OfflineAudioContext === "undefined") {
        setError(messages.unsupportedError)
        return
      }
      const context = new OfflineAudioContext(2, 1, SAMPLE_RATE)
      for (const file of files) {
        try {
          const buffer = await context.decodeAudioData(await file.arrayBuffer())
          if (!mounted.current) return
          if (buffer.numberOfChannels > 2) {
            errors.push(messages.channelError.replace("{name}", file.name))
            continue
          }
          added.push({
            id: crypto.randomUUID(),
            name: file.name,
            buffer,
            peaks: waveform(
              Array.from({ length: buffer.numberOfChannels }, (_, i) =>
                buffer.getChannelData(i)
              )
            ),
            start: 0,
            end: buffer.duration,
          })
        } catch {
          errors.push(messages.readError.replace("{name}", file.name))
        }
        if (!mounted.current) return
      }
      setClips((previous) => [...previous, ...added])
      setError(errors.join(" "))
    } catch {
      if (mounted.current) setError(messages.unsupportedError)
    } finally {
      locked.current = false
      if (mounted.current) setBusy(null)
    }
  }

  function update(id: string, range: { start: number; end: number }) {
    invalidate()
    setClips((previous) =>
      previous.map((clip) => (clip.id === id ? { ...clip, ...range } : clip))
    )
  }

  function move(index: number, direction: number) {
    invalidate()
    setClips((previous) => {
      const next = [...previous]
      const target = index + direction
      if (target < 0 || target >= next.length) return previous
      ;[next[index], next[target]] = [next[target]!, next[index]!]
      return next
    })
  }

  function remove(index: number) {
    invalidate()
    setRemoved({ clip: clips[index]!, index })
    setClips((previous) => previous.filter((_, i) => i !== index))
  }

  function undo() {
    if (!removed) return
    invalidate()
    setClips((previous) => {
      const next = [...previous]
      next.splice(removed.index, 0, removed.clip)
      return next
    })
    setRemoved(null)
  }

  function exportAudio() {
    if (locked.current || !valid) return
    locked.current = true
    invalidate()
    setBusy("exporting")
    const finish = () => {
      worker.current?.terminate()
      worker.current = null
      locked.current = false
      setBusy(null)
    }
    try {
      const encoder = new Worker(
        new URL("../workers/encode.ts", import.meta.url),
        { type: "module" }
      )
      worker.current = encoder
      encoder.onmessage = (event: MessageEvent<{ buffer?: ArrayBuffer }>) => {
        if (event.data.buffer) {
          const blob = new Blob([event.data.buffer], { type: "audio/wav" })
          setResult({
            url: URL.createObjectURL(blob),
          })
        } else setError(messages.exportError)
        finish()
      }
      encoder.onerror = () => {
        setError(messages.exportError)
        finish()
      }
      const selected = clips.map((clip) => {
        const [start, end] = frameRange(
          clip.start,
          clip.end,
          clip.buffer.length
        )
        return {
          channels: Array.from(
            { length: clip.buffer.numberOfChannels },
            (_, i) => clip.buffer.getChannelData(i).slice(start, end)
          ),
        }
      })
      encoder.postMessage(
        { clips: selected, smooth },
        selected.flatMap((clip) =>
          clip.channels.map((channel) => channel.buffer)
        )
      )
    } catch {
      setError(messages.exportError)
      finish()
    }
  }

  return {
    clips,
    removed,
    busy,
    error,
    result,
    name,
    smooth,
    duration,
    valid,
    preview,
    addFiles,
    update,
    move,
    remove,
    undo,
    exportAudio,
    setName,
    setSmooth: (value: boolean) => {
      invalidate()
      setSmooth(value)
    },
  }
}
