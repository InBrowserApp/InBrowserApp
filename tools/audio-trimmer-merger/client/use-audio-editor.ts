import { useEffect, useRef, useState } from "react"
import { frameRange, SAMPLE_RATE, validRange, waveform } from "../core/audio"
import { usePreview } from "./use-preview"
import { useAudioExport } from "./use-audio-export"
import { audioLayout, validJoin } from "../core/mix"
import { DEFAULT_SETTINGS, estimateBytes } from "../core/settings"
import type { AudioClip, AudioEditorMessages, ExportSettings } from "../types"

export function useAudioEditor(messages: AudioEditorMessages) {
  const [clips, setClips] = useState<AudioClip[]>([])
  const [removed, setRemoved] = useState<{
    clip: AudioClip
    index: number
  } | null>(null)
  const [reading, setReading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("audio")
  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_SETTINGS)
  const mounted = useRef(true)
  const locked = useRef(false)
  const preview = usePreview(() => setError(messages.playError))
  const output = useAudioExport(locked, () => setError(messages.exportError))
  const busy = reading ? "reading" : output.exporting ? "exporting" : null
  const valid =
    clips.length > 0 &&
    (clips.length < 2 || validJoin(settings.join)) &&
    clips.every((clip) =>
      validRange(clip.start, clip.end, clip.buffer.duration)
    )
  const lengths = clips.map((clip) => {
    if (!validRange(clip.start, clip.end, clip.buffer.duration)) return 0
    const [first, last] = frameRange(clip.start, clip.end, clip.buffer.length)
    return last - first
  })
  const { frames } = audioLayout(
    lengths,
    validJoin(settings.join) ? settings.join : DEFAULT_SETTINGS.join
  )
  const duration = frames / SAMPLE_RATE
  const channels = Math.max(
    1,
    ...clips.map((clip) => clip.buffer.numberOfChannels)
  )
  const estimatedBytes = estimateBytes(
    frames,
    channels,
    settings.format,
    settings.quality
  )

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  function invalidate() {
    preview.stop()
    output.clear()
    setError("")
  }

  async function addFiles(files: File[]) {
    if (locked.current || !files.length) return
    locked.current = true
    invalidate()
    setReading(true)
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
      if (!clips.length && added.length)
        setName((previous) =>
          previous === "audio"
            ? added[0]!.name.replace(/\.[^.]+$/, "")
            : previous
        )
      setClips((previous) => [...previous, ...added])
      setError(errors.join(" "))
    } catch {
      if (mounted.current) setError(messages.unsupportedError)
    } finally {
      locked.current = false
      if (mounted.current) setReading(false)
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

  function duplicate(index: number) {
    invalidate()
    setClips((previous) => {
      const next = [...previous]
      next.splice(index + 1, 0, {
        ...previous[index]!,
        id: crypto.randomUUID(),
      })
      return next
    })
  }

  function exportAudio() {
    if (locked.current || !valid) return
    invalidate()
    output.start(clips, settings)
  }

  function changeSettings(value: ExportSettings) {
    invalidate()
    setSettings(value)
  }

  return {
    clips,
    removed,
    busy,
    error,
    result: output.result,
    progress: output.progress,
    cancelExport: output.cancel,
    estimatedBytes,
    name,
    settings,
    setSettings: changeSettings,
    duplicate,
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
  }
}
