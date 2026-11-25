import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { RefreshCcw } from "@workspace/ui/icons"

import type English from "./messages/en.json"

const sampleDuration = 1800
type Reading =
  | { status: "measuring" | "paused" | "unavailable" }
  | { status: "ready"; hertz: number; frameInterval: number }

export default function RefreshRateTest({
  language,
  messages,
}: {
  language: string
  messages: typeof English
}) {
  const [reading, setReading] = useState<Reading>({ status: "measuring" })
  const [attempt, setAttempt] = useState(0)
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 1 })

  useEffect(() => {
    let frame: number | undefined

    function cancelSample() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
    }

    function sample() {
      cancelSample()
      if (document.hidden) {
        setReading({ status: "paused" })
        return
      }

      const intervals: number[] = []
      let firstTimestamp: number | undefined
      let lastTimestamp: number | undefined
      setReading({ status: "measuring" })

      function track(timestamp: number) {
        firstTimestamp ??= timestamp
        if (lastTimestamp !== undefined && timestamp > lastTimestamp) {
          intervals.push(timestamp - lastTimestamp)
        }
        lastTimestamp = timestamp

        if (timestamp - firstTimestamp < sampleDuration) {
          frame = requestAnimationFrame(track)
          return
        }

        frame = undefined
        if (intervals.length < 2) {
          setReading({ status: "unavailable" })
          return
        }

        intervals.sort((left, right) => left - right)
        const middle = Math.floor(intervals.length / 2)
        const lower = Math.floor((intervals.length - 1) / 2)
        const median = (intervals[lower]! + intervals[middle]!) / 2
        // Keep both ordinary timestamp buckets on browsers that round to 2 ms.
        const delayThreshold = Math.max(median * 1.5, median + 2)
        let elapsed = 0
        let frames = 0
        for (const interval of intervals) {
          if (interval > delayThreshold) break
          elapsed += interval
          frames++
        }
        const frameInterval = elapsed / frames
        setReading({
          status: "ready",
          hertz: 1000 / frameInterval,
          frameInterval,
        })
      }

      frame = requestAnimationFrame(track)
    }

    sample()
    document.addEventListener("visibilitychange", sample)
    return () => {
      cancelSample()
      document.removeEventListener("visibilitychange", sample)
    }
  }, [attempt])

  return (
    <section className="flex flex-wrap items-end justify-between gap-5 rounded-xl border bg-card p-5 sm:p-6">
      <div role="status" aria-atomic="true" className="min-w-0 space-y-2">
        <div className="text-sm font-medium">{messages.estimate}</div>
        <div className="font-heading text-5xl leading-none tracking-tight tabular-nums sm:text-6xl">
          <bdi dir="ltr" className="inline-flex items-baseline gap-2">
            {reading.status === "ready" ? number.format(reading.hertz) : "—"}
            <span className="text-2xl text-muted-foreground sm:text-3xl">
              {" Hz"}
            </span>
          </bdi>
        </div>
        {reading.status === "ready" ? (
          <div className="text-sm text-muted-foreground">
            {messages.frameInterval}
            <bdi className="ms-2 font-medium text-foreground" dir="ltr">
              {number.format(reading.frameInterval)} ms
            </bdi>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {messages[reading.status]}
          </div>
        )}
      </div>
      <Button
        className="min-h-10"
        type="button"
        onClick={() => setAttempt((value) => value + 1)}
      >
        <RefreshCcw aria-hidden="true" />
        {messages.measureAgain}
      </Button>
    </section>
  )
}
