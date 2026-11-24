import { useEffect, useRef, useState } from "react"
import { hasTranscriptText } from "./core/transcript"
import { SAMPLE_RATE } from "./worker-messages"
import type { Transcript } from "./core/transcript"
import type { ModelId } from "./models"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "./worker-messages"

type Job = { worker?: Worker }
type Status =
  | { type: "decoding" }
  | Extract<TranscriptionResponse, { type: "loading" | "transcribing" }>
type ErrorMessage =
  | "decodeError"
  | "modelError"
  | "transcriptionError"
  | "noSpeech"
  | "alignmentFallback"

const EMPTY_DRAFT: Transcript = { kind: "timed", segments: [] }

async function decode(file: File) {
  const context = new OfflineAudioContext(1, 1, SAMPLE_RATE)
  const decoded = await context.decodeAudioData(await file.arrayBuffer())
  if (decoded.numberOfChannels === 1) return decoded.getChannelData(0)

  // Use the browser's speaker-layout downmix for stereo and surround audio.
  const mono = new OfflineAudioContext(1, decoded.length, SAMPLE_RATE)
  const source = mono.createBufferSource()
  source.buffer = decoded
  source.connect(mono.destination)
  source.start()
  return (await mono.startRendering()).getChannelData(0)
}

function useTranscription() {
  const active = useRef<Job | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [draft, setDraft] = useState<Transcript>(EMPTY_DRAFT)
  const [error, setError] = useState<ErrorMessage | null>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    return () => {
      active.current?.worker?.terminate()
      active.current = null
    }
  }, [])

  function stop() {
    active.current?.worker?.terminate()
    active.current = null
    setStatus(null)
    setDraft(EMPTY_DRAFT)
  }

  function clear() {
    setError(null)
    setTranscript(null)
    setFallback(false)
  }

  async function start(file: File, model: ModelId, language: string) {
    const job: Job = {}
    active.current = job
    setError(null)
    setFallback(false)
    setStatus({ type: "decoding" })

    function fail(message: ErrorMessage) {
      stop()
      setError(message)
    }

    function run(audio: Float32Array<ArrayBuffer>, cpuOnly: boolean) {
      try {
        const worker =
          model === "senseVoice"
            ? new Worker(
                new URL("./workers/sense-voice.worker.ts", import.meta.url),
                { type: "module" }
              )
            : model === "qwenPlain" || model === "qwenTimed"
              ? new Worker(
                  new URL("./workers/qwen.worker.ts", import.meta.url),
                  {
                    type: "module",
                  }
                )
              : new Worker(
                  new URL("./workers/transcribe.worker.ts", import.meta.url),
                  { type: "module" }
                )
        job.worker = worker
        worker.onmessage = ({ data }: MessageEvent<TranscriptionResponse>) => {
          if (active.current !== job || job.worker !== worker) return
          switch (data.type) {
            case "loading":
              setStatus(data)
              break
            case "transcribing":
              if (data.partialText !== undefined) {
                setDraft({ kind: "plain", text: data.partialText })
              } else if (data.partialSegments) {
                setDraft({ kind: "timed", segments: data.partialSegments })
              }
              setStatus(data)
              break
            case "retry":
              worker.terminate()
              setFallback(true)
              setDraft(EMPTY_DRAFT)
              setStatus({ type: "loading", backend: "wasm" })
              run(data.audio, true)
              break
            case "done": {
              const result: Transcript =
                data.plainText !== undefined
                  ? { kind: "plain", text: data.plainText }
                  : { kind: "timed", segments: data.segments }
              stop()
              if (hasTranscriptText(result)) {
                setTranscript(result)
                if ("alignmentFallback" in data && data.alignmentFallback)
                  setError("alignmentFallback")
              } else setError("noSpeech")
              break
            }
            case "error":
              fail(data.stage)
          }
        }
        worker.onerror = () => {
          if (active.current === job && job.worker === worker) {
            fail("transcriptionError")
          }
        }
        const request: TranscriptionRequest = {
          audio,
          model,
          language,
          cpuOnly,
        }
        worker.postMessage(request, [audio.buffer])
      } catch {
        fail("transcriptionError")
      }
    }

    let audio: Float32Array<ArrayBuffer>
    try {
      audio = await decode(file)
    } catch {
      if (active.current === job) fail("decodeError")
      return
    }
    if (active.current === job) run(audio, false)
  }

  return {
    status,
    transcript,
    draft,
    setTranscript,
    error,
    fallback,
    start,
    stop,
    clear,
  }
}

export { useTranscription }
