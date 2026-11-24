import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { MINIMUM_FRAMES, SAMPLE_RATE } from "./core/loudness"
import { AudioFilePicker } from "./file-picker"
import { LoudnessResult } from "./result"
import type { Request, Response } from "./workers/normalize"
import type englishMessages from "./messages/en.json"

type Messages = typeof englishMessages
type Source = Extract<Response, { type: "measured" }> & { worker: Worker }
type State =
  | { status: "idle" | "reading" }
  | {
      status: "error"
      key: "readError" | "channelError" | "shortError" | "quietError"
    }
  | { status: "ready"; source: Source }

export default function AudioLoudnessNormalizer({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const active = useRef<Worker>(null)
  const [fileName, setFileName] = useState("")
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
    setFileName(file.name)
    setState({ status: "reading" })
    let started: Worker | null = null

    function fail(key: Extract<State, { status: "error" }>["key"]) {
      if (active.current !== started) return
      started?.terminate()
      active.current = null
      setState({ status: "error", key })
    }

    try {
      const worker = new Worker(
        new URL("./workers/normalize.ts", import.meta.url),
        { type: "module" }
      )
      started = worker
      active.current = worker
      worker.onerror = () => fail("readError")
      worker.onmessage = ({ data }: MessageEvent<Response>) => {
        if (active.current !== worker) return
        if (data.type === "quiet") fail("quietError")
        if (data.type === "measured")
          setState({ status: "ready", source: { ...data, worker } })
      }

      const context = new OfflineAudioContext(1, 1, SAMPLE_RATE)
      const audio = await context.decodeAudioData(await file.arrayBuffer())
      if (active.current !== worker) return
      if (audio.numberOfChannels > 2) {
        fail("channelError")
        return
      }
      if (audio.length < MINIMUM_FRAMES) {
        fail("shortError")
        return
      }
      // AudioBuffer may retain its planes. Transfer owned copies to the worker.
      const channels = Array.from({ length: audio.numberOfChannels }, (_, i) =>
        audio.getChannelData(i).slice()
      )
      const message: Request = { type: "measure", channels }
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
        name={fileName}
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
            {m.measuring}
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
        <LoudnessResult
          worker={state.source.worker}
          original={state.source}
          name={fileName}
          messages={m}
          lang={lang}
        />
      )}
    </div>
  )
}
