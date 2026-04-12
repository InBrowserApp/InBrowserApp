import { useEffect, useEffectEvent, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  createNetworkBaseline,
  readNetworkClockTime,
} from "./core/network-time"

import type { NetworkTimeBaseline } from "./core/network-time"

type CurrentNetworkTimeMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  lastSyncedAt: string
  errorTitle: string
  offset: string
  syncing: string
}>

type CurrentNetworkTimeClientProps = Readonly<{
  language: string
  messages: CurrentNetworkTimeMessages
}>

type SyncStatus = "syncing" | "synced" | "error"

const CLOUDFLARE_TRACE_URL = "https://cloudflare.com/cdn-cgi/trace"
const CLOCK_TICK_INTERVAL_MS = 250
const RESYNC_INTERVAL_MS = 5_000
const PLACEHOLDER = "\u2014"

function formatClockTime(valueMs: number, language: string) {
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(valueMs)
}

function formatCalendarDate(valueMs: number, language: string) {
  return new Intl.DateTimeFormat(language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(valueMs)
}

function formatMilliseconds(value: number, language: string) {
  return new Intl.NumberFormat(language).format(Math.round(value))
}

function formatOffset(
  offsetMs: number | undefined,
  roundTripTimeMs: number,
  language: string
) {
  if (offsetMs === undefined) {
    return PLACEHOLDER
  }

  return `${formatMilliseconds(offsetMs, language)} ms (±${formatMilliseconds(roundTripTimeMs, language)} ms)`
}

function formatLastSyncedAt(valueMs: number, language: string) {
  if (valueMs <= 0) {
    return PLACEHOLDER
  }

  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(valueMs)
}

function CurrentNetworkTimeClient({
  language,
  messages,
}: CurrentNetworkTimeClientProps) {
  const baselineRef = useRef<NetworkTimeBaseline | null>(null)
  const syncInFlightRef = useRef(false)

  const [status, setStatus] = useState<SyncStatus>("syncing")
  const [error, setError] = useState<string | null>(null)
  const [localTimeMs, setLocalTimeMs] = useState(() => Date.now())
  const [networkTimeMs, setNetworkTimeMs] = useState<number | undefined>(
    undefined
  )
  const [roundTripTimeMs, setRoundTripTimeMs] = useState(0)
  const [offsetMs, setOffsetMs] = useState<number | undefined>(undefined)
  const [lastSyncAtMs, setLastSyncAtMs] = useState(0)

  const tickClock = useEffectEvent(() => {
    const nowEpochMs = Date.now()
    setLocalTimeMs(nowEpochMs)

    const baseline = baselineRef.current

    setNetworkTimeMs(
      baseline ? readNetworkClockTime(baseline, performance.now()) : undefined
    )
  })

  const syncNow = useEffectEvent(async () => {
    if (syncInFlightRef.current) {
      return
    }

    syncInFlightRef.current = true
    setStatus("syncing")
    setError(null)

    try {
      const startPerformanceMs = performance.now()
      const response = await fetch(CLOUDFLARE_TRACE_URL, {
        cache: "no-store",
        credentials: "omit",
        mode: "cors",
      })
      const trace = await response.text()
      const endPerformanceMs = performance.now()
      const localEpochMs = Date.now()
      const baseline = createNetworkBaseline({
        trace,
        startPerformanceMs,
        endPerformanceMs,
        localEpochMs,
      })

      baselineRef.current = baseline

      setLocalTimeMs(localEpochMs)
      setNetworkTimeMs(readNetworkClockTime(baseline, performance.now()))
      setRoundTripTimeMs(baseline.roundTripTimeMs)
      setOffsetMs(baseline.offsetMs)
      setLastSyncAtMs(localEpochMs)
      setStatus("synced")
    } catch (caughtError) {
      baselineRef.current = null
      setNetworkTimeMs(undefined)
      setOffsetMs(undefined)
      setError(
        caughtError instanceof Error ? caughtError.message : String(caughtError)
      )
      setStatus("error")
    } finally {
      syncInFlightRef.current = false
    }
  })

  useEffect(() => {
    tickClock()

    const intervalId = window.setInterval(() => {
      tickClock()
    }, CLOCK_TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    void syncNow()

    const intervalId = window.setInterval(() => {
      void syncNow()
    }, RESYNC_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const displayedTimeMs = networkTimeMs ?? localTimeMs

  return (
    <div className="grid gap-6">
      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="overflow-hidden border-border/80 bg-linear-to-br from-sky-500/10 via-card to-emerald-500/10 shadow-[var(--shadow-elevated)]">
        <CardContent className="p-0">
          <div className="relative isolate overflow-hidden px-6 py-10 sm:px-8 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_42%)]" />

            <div className="relative flex flex-col items-center gap-6 text-center">
              {status === "syncing" ? (
                <Badge
                  variant="secondary"
                  className="gap-1.5 border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                >
                  <span className="size-2 animate-pulse rounded-full bg-current opacity-80" />
                  {messages.syncing}
                </Badge>
              ) : null}

              <div className="w-full rounded-[2rem] border border-border/70 bg-background/75 px-4 py-8 shadow-inner backdrop-blur sm:px-8 sm:py-10">
                <p className="font-mono text-[clamp(3rem,11vw,6.5rem)] font-semibold tracking-tight text-foreground tabular-nums">
                  {formatClockTime(displayedTimeMs, language)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  {formatCalendarDate(displayedTimeMs, language)}
                </p>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 text-left shadow-xs backdrop-blur">
                  <p className="text-sm text-muted-foreground">
                    {messages.offset}
                  </p>
                  <p className="mt-2 font-mono text-xl text-foreground tabular-nums sm:text-2xl">
                    {formatOffset(offsetMs, roundTripTimeMs, language)}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 text-left shadow-xs backdrop-blur">
                  <p className="text-sm text-muted-foreground">
                    {messages.lastSyncedAt}
                  </p>
                  <p className="mt-2 font-mono text-xl text-foreground tabular-nums sm:text-2xl">
                    {formatLastSyncedAt(lastSyncAtMs, language)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CurrentNetworkTimeClient
