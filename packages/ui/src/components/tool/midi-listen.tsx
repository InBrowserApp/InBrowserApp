import { useEffect, useRef, useState } from "react"
import type { Response } from "@workspace/midi-audio/worker-client"
import { Button } from "@workspace/ui/components/ui/button"
import { LoaderCircle, Play } from "@workspace/ui/icons"

export type ListenMessages = Record<
  "listen" | "audioLoading" | "audioError" | "audioPreview",
  string
>

type Audition = { worker?: Worker }

export function MidiListen({
  readMidi,
  messages: m,
}: {
  readMidi: () => File | Promise<File>
  messages: ListenMessages
}) {
  const [status, setStatus] = useState<"loading" | "error">()
  const [wav, setWav] = useState<ArrayBuffer>()
  const [url, setUrl] = useState("")
  const button = useRef<HTMLButtonElement>(null)
  const focusPlayer = useRef(false)
  const active = useRef<Audition | null>(null)

  useEffect(
    () => () => {
      active.current?.worker?.terminate()
      active.current = null
    },
    []
  )

  useEffect(() => {
    if (!wav) return
    focusPlayer.current = document.activeElement === button.current
    const next = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }))
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [wav])

  async function listen() {
    if (status === "loading" || active.current) return
    setStatus("loading")
    const audition: Audition = {}
    active.current = audition
    function finish(data?: ArrayBuffer) {
      if (active.current !== audition) return
      audition.worker?.terminate()
      active.current = null
      if (data) setWav(data)
      else setStatus("error")
    }

    try {
      const [{ createMidiRenderWorker }, file] = await Promise.all([
        import("@workspace/midi-audio/worker-client"),
        readMidi(),
      ])
      if (active.current !== audition) return
      const worker = createMidiRenderWorker()
      audition.worker = worker
      worker.onmessage = ({ data }: MessageEvent<Response>) => {
        if (data.type === "complete") finish(data.wav)
        else if (data.type === "error") finish()
      }
      worker.onerror = () => finish()
      worker.onmessageerror = () => finish()
      worker.postMessage({ file })
    } catch {
      finish()
    }
  }

  if (url) {
    return (
      // oxlint-disable-next-line jsx-a11y/media-has-caption -- This preview plays instrumental music on request.
      <audio
        ref={(player) => {
          if (player && focusPlayer.current) {
            focusPlayer.current = false
            player.focus({ preventScroll: true })
          }
        }}
        controls
        autoPlay
        tabIndex={0}
        src={url}
        aria-label={m.audioPreview}
        className="h-11 w-full min-w-0"
      />
    )
  }

  return (
    <>
      <Button
        ref={button}
        type="button"
        variant="outline"
        className="h-auto min-h-11 w-full whitespace-normal aria-disabled:opacity-50"
        aria-disabled={status === "loading"}
        onClick={() => void listen()}
      >
        {status === "loading" ? (
          <LoaderCircle
            aria-hidden="true"
            className="motion-safe:animate-spin"
          />
        ) : (
          <Play aria-hidden="true" />
        )}
        {status === "loading" ? m.audioLoading : m.listen}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {m.audioError}
        </p>
      )}
    </>
  )
}
