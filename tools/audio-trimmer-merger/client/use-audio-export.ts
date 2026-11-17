import { useEffect, useRef, useState, type RefObject } from "react"
import { frameRange } from "../core/audio"
import { FORMATS } from "../core/settings"
import type {
  AudioClip,
  AudioResult,
  EncodeRequest,
  EncodeResponse,
  ExportSettings,
} from "../types"

export function useAudioExport(
  locked: RefObject<boolean>,
  onError: () => void
) {
  const worker = useRef<Worker | null>(null)
  const [result, setResult] = useState<AudioResult | null>(null)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(
    () => () => {
      worker.current?.terminate()
      worker.current = null
    },
    []
  )
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url)
    },
    [result]
  )

  function finish() {
    worker.current?.terminate()
    worker.current = null
    locked.current = false
    setExporting(false)
  }

  function cancel() {
    finish()
    setProgress(0)
  }

  function start(clips: AudioClip[], settings: ExportSettings) {
    if (locked.current) return
    locked.current = true
    setResult(null)
    setExporting(true)
    setProgress(0)
    try {
      const encoder = new Worker(
        new URL("../workers/encode.ts", import.meta.url),
        { type: "module" }
      )
      worker.current = encoder
      encoder.onmessage = (event: MessageEvent<EncodeResponse>) => {
        if (worker.current !== encoder) return
        const data = event.data
        if ("progress" in data) {
          setProgress(data.progress)
          return
        }
        if ("buffer" in data) {
          const blob = new Blob([data.buffer], {
            type: FORMATS[settings.format].mime,
          })
          setResult({
            url: URL.createObjectURL(blob),
            format: settings.format,
            bytes: blob.size,
          })
          setProgress(100)
        } else onError()
        finish()
      }
      encoder.onerror = () => {
        if (worker.current !== encoder) return
        onError()
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
        { clips: selected, settings } satisfies EncodeRequest,
        selected.flatMap((clip) =>
          clip.channels.map((channel) => channel.buffer)
        )
      )
    } catch {
      onError()
      finish()
    }
  }

  return {
    result,
    exporting,
    progress,
    start,
    cancel,
    clear: () => setResult(null),
  }
}
