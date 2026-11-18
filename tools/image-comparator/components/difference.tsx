import { useEffect, useRef, useState } from "react"
import { LoaderCircle } from "@workspace/ui/icons"
import { Adjustment } from "./adjustment"
import { BitmapCanvas, PreviewFrame } from "./preview"
import type { DifferenceReply, DifferenceRequest } from "../difference.worker"
import type { Messages } from "../types"

export function Difference({
  before,
  after,
  dir,
  tolerance,
  setTolerance,
  messages: m,
  numbers,
  percent,
}: {
  before: ImageBitmap
  after: ImageBitmap
  dir: "ltr" | "rtl"
  tolerance: number
  setTolerance: (value: number) => void
  messages: Messages
  numbers: Intl.NumberFormat
  percent: Intl.NumberFormat
}) {
  const [value, setValue] = useState(tolerance)
  const [reply, setReply] = useState<DifferenceReply | null>(null)
  const worker = useRef<Worker | null>(null)
  const bitmap = reply?.type === "result" ? reply.bitmap : null

  useEffect(() => {
    let instance: Worker | undefined
    const fail = () => {
      instance?.terminate()
      worker.current = null
      setReply({ type: "error" })
    }

    try {
      instance = new Worker(
        new URL("../difference.worker.ts", import.meta.url),
        { type: "module" }
      )
      instance.onmessage = ({ data }: MessageEvent<DifferenceReply>) => {
        if (data.type === "error") fail()
        else setReply(data)
      }
      instance.onerror = (event) => {
        event.preventDefault()
        fail()
      }
      const sources: DifferenceRequest = { before, after }
      instance.postMessage(sources)
      worker.current = instance
    } catch {
      fail()
    }

    return () => {
      instance?.terminate()
      worker.current = null
    }
  }, [before, after])

  useEffect(() => {
    worker.current?.postMessage(tolerance satisfies DifferenceRequest)
  }, [before, after, tolerance])

  useEffect(() => () => bitmap?.close(), [bitmap])

  const current = reply?.type === "result" && reply.tolerance === tolerance
  const failed = reply?.type === "error"
  const { width, height } = before
  const total = width * height

  return (
    <>
      {!failed && (
        <Adjustment
          label={m.tolerance}
          hint={m.toleranceHint}
          dir={dir}
          value={value}
          onChange={setValue}
          onCommit={setTolerance}
          percent={percent}
        />
      )}
      <div
        role="status"
        className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      >
        {failed ? (
          <span className="text-destructive">{m.diffError}</span>
        ) : current ? (
          <>
            <span
              className="size-2.5 rounded-sm bg-[#e0006f]"
              aria-hidden="true"
            />
            <span>{m.changedPixels}</span>
            <bdi className="font-medium tabular-nums">
              {percent.format(reply.changed / total)}
            </bdi>
            <bdi className="text-muted-foreground tabular-nums">
              {numbers.format(reply.changed)} / {numbers.format(total)}
            </bdi>
          </>
        ) : (
          <>
            <LoaderCircle
              className="size-4 motion-safe:animate-spin"
              aria-hidden="true"
            />
            <span>{m.diffLoading}</span>
          </>
        )}
      </div>
      {!failed && (
        <PreviewFrame width={width} height={height}>
          {bitmap && (
            <div
              role="img"
              aria-label={m.differencePreview}
              className="absolute inset-0 overflow-hidden rounded-[inherit]"
            >
              <BitmapCanvas bitmap={bitmap} className="size-full" />
            </div>
          )}
        </PreviewFrame>
      )}
    </>
  )
}
