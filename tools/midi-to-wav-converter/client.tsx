import { useEffect, useRef, useState } from "react"
import { AudioPreviewDownload } from "@workspace/ui/components/tool/audio-preview-download"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { ToolOpenTextFile } from "@workspace/ui/components/tool/tool-open-text-file"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { AudioLines, Piano } from "@workspace/ui/icons"

import type english from "./messages/en.json"
import type { Request, Response } from "./render.worker"

type State = { type: "idle" } | Response

export default function MidiToWav({
  messages: m,
}: {
  messages: typeof english
}) {
  const active = useRef<Worker>(null)
  const [file, setFile] = useState<File>()
  const [soundFont, setSoundFont] = useState<File>()
  const [state, setState] = useState<State>({ type: "idle" })
  const rendering = state.type === "progress"

  useEffect(() => () => active.current?.terminate(), [])

  function stop() {
    active.current?.terminate()
    active.current = null
  }

  function reset() {
    stop()
    setState({ type: "idle" })
  }

  function changeSoundFont(next?: File) {
    reset()
    setSoundFont(next)
  }

  function start() {
    if (!file || rendering) return
    try {
      const worker = new Worker(
        new URL("./render.worker.ts", import.meta.url),
        { type: "module" }
      )
      active.current = worker
      setState({ type: "progress", percent: 0 })
      function receive(data: Response) {
        if (active.current !== worker) return
        if (data.type !== "progress") stop()
        setState(data)
      }
      worker.onmessage = ({ data }: MessageEvent<Response>) => receive(data)
      worker.onerror = () => receive({ type: "error", key: "renderFailed" })
      worker.postMessage({ file, soundFont } satisfies Request)
    } catch {
      stop()
      setState({ type: "error", key: "renderFailed" })
    }
  }

  return (
    <div className="grid gap-4">
      <FileDropPicker
        name={file?.name ?? ""}
        accept=".mid,.midi,audio/midi,audio/x-midi"
        formats=".mid · .midi"
        icon={Piano}
        labels={m}
        onFile={(next) => {
          reset()
          setFile(next)
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-medium">{m.soundFont}</h2>
              <p className="mt-1 text-sm wrap-anywhere text-muted-foreground">
                {soundFont ? <bdi>{soundFont.name}</bdi> : m.defaultSoundFont}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 [&_button]:min-h-11 sm:[&_button]:min-h-8">
              <ToolOpenTextFile
                accept=".sf2,.sf3"
                label={m.chooseSoundFont}
                onFile={changeSoundFont}
              />
              {soundFont && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => changeSoundFont()}
                >
                  {m.useDefaultSoundFont}
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{m.soundFontHint}</p>
          {state.type === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {m[state.key]}
            </p>
          )}
          {rendering ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="grow basis-40">
                <p role="status" className="text-sm font-medium">
                  {m.rendering}
                </p>
                <progress
                  className="w-full accent-primary"
                  value={state.percent}
                  max={100}
                  aria-label={m.rendering}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={reset}
              >
                {m.cancel}
              </Button>
            </div>
          ) : state.type !== "complete" ? (
            <Button
              type="button"
              disabled={!file}
              onClick={start}
              className="min-h-11 sm:self-start"
            >
              <AudioLines data-icon="inline-start" aria-hidden="true" />
              {m.render}
            </Button>
          ) : null}
          {state.type === "complete" && file && (
            <AudioPreviewDownload
              wav={state.wav}
              filename={file.name.replace(/\.(mid|midi)$/i, "") + ".wav"}
              previewLabel={m.preview}
              downloadLabel={m.download}
            />
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
