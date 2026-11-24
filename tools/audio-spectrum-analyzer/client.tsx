import { useEffect, useRef, useState } from "react"
import { AudioFilePicker } from "@workspace/ui/components/tool/audio-file-picker"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { SAMPLE_RATE } from "./core/spectrum"
import { SpectrumPanel } from "./spectrum-panel"
import type englishMessages from "./messages/en.json"
import type { Response } from "./workers/analyze"

type Messages = typeof englishMessages
type State =
  | { status: "idle" | "reading" }
  | { status: "error"; key: "readError" | "channelError" }
  | { status: "ready"; file: File; spectrum: Response }

export default function AudioSpectrumAnalyzer({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const active = useRef<Worker>(null)
  const [name, setName] = useState("")
  const [state, setState] = useState<State>({ status: "idle" })

  useEffect(
    () => () => {
      active.current?.terminate()
      active.current = null
    },
    []
  )

  async function open(file: File) {
    active.current?.terminate()
    active.current = null
    setName(file.name)
    setState({ status: "reading" })
    let current: Worker | null = null

    function finish(next: State) {
      if (active.current !== current) return
      current?.terminate()
      active.current = null
      setState(next)
    }

    try {
      const worker = new Worker(
        new URL("./workers/analyze.ts", import.meta.url),
        { type: "module" }
      )
      active.current = current = worker
      worker.onerror = () => finish({ status: "error", key: "readError" })
      worker.onmessage = ({ data }: MessageEvent<Response>) =>
        finish({ status: "ready", file, spectrum: data })

      const context = new OfflineAudioContext(1, 1, SAMPLE_RATE)
      const audio = await context.decodeAudioData(await file.arrayBuffer())
      if (active.current !== worker) return
      if (audio.numberOfChannels > 2) {
        finish({ status: "error", key: "channelError" })
        return
      }
      const channels = Array.from({ length: audio.numberOfChannels }, (_, i) =>
        audio.getChannelData(i).slice()
      )
      worker.postMessage(
        channels,
        channels.map((channel) => channel.buffer)
      )
    } catch {
      finish({ status: "error", key: "readError" })
    }
  }

  return (
    <div className="grid gap-4">
      <AudioFilePicker
        name={name}
        labels={m}
        onFile={(file) => void open(file)}
      />
      <div
        role="status"
        className={
          state.status === "reading"
            ? "flex items-center gap-2 text-sm"
            : "sr-only"
        }
      >
        {state.status === "reading" ? (
          <>
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m.analyzing}
          </>
        ) : state.status === "ready" ? (
          m.ready
        ) : null}
      </div>
      {state.status === "error" && (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{m[state.key]}</AlertDescription>
        </Alert>
      )}
      {state.status === "ready" && (
        <SpectrumPanel
          file={state.file}
          spectrum={state.spectrum}
          lang={lang}
          messages={m}
        />
      )}
    </div>
  )
}
