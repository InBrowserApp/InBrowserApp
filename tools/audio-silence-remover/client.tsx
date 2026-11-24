import { useEffect, useRef, useState } from "react"
import { AudioFilePicker } from "@workspace/ui/components/tool/audio-file-picker"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { SAMPLE_RATE } from "./core/silence"
import { EditPanel } from "./edit-panel"
import type englishMessages from "./messages/en.json"
import type { Request, Response } from "./workers/remove"

type Messages = typeof englishMessages
type Source = Extract<Response, { type: "analyzed" }> & { worker: Worker }
type State =
  | { status: "idle" | "reading" }
  | { status: "error"; key: "readError" | "channelError" }
  | { status: "ready"; source: Source }

export default function AudioSilenceRemover({
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
    function fail(key: "readError" | "channelError") {
      if (active.current !== current) return
      current?.terminate()
      active.current = null
      setState({ status: "error", key })
    }
    try {
      const worker = new Worker(
        new URL("./workers/remove.ts", import.meta.url),
        { type: "module" }
      )
      active.current = current = worker
      worker.onerror = () => fail("readError")
      worker.onmessage = ({ data }: MessageEvent<Response>) => {
        if (active.current === worker && data.type === "analyzed")
          setState({ status: "ready", source: { ...data, worker } })
      }
      const context = new OfflineAudioContext(1, 1, SAMPLE_RATE)
      const audio = await context.decodeAudioData(await file.arrayBuffer())
      if (active.current !== worker) return
      if (audio.numberOfChannels > 2) {
        fail("channelError")
        return
      }
      const channels = Array.from({ length: audio.numberOfChannels }, (_, i) =>
        audio.getChannelData(i).slice()
      )
      const message: Request = { type: "analyze", channels }
      worker.postMessage(
        message,
        channels.map((channel) => channel.buffer)
      )
    } catch {
      fail("readError")
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
        {state.status === "reading" && (
          <>
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m.analyzing}
          </>
        )}
      </div>
      {state.status === "error" && (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{m[state.key]}</AlertDescription>
        </Alert>
      )}
      {state.status === "ready" && (
        <EditPanel {...state.source} name={name} lang={lang} messages={m} />
      )}
    </div>
  )
}
