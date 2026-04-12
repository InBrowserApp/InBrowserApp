import { useEffect, useEffectEvent, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
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
  const showSyncingIndicator = status === "syncing" && lastSyncAtMs === 0

  return (
    <div className="grid gap-6">
      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-8 px-1 py-2">
        <div className="space-y-4 text-center">
          <div
            aria-live="polite"
            className="flex min-h-5 items-center justify-center text-sm text-muted-foreground"
          >
            {showSyncingIndicator ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 animate-pulse rounded-full bg-current opacity-70" />
                {messages.syncing}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[clamp(3rem,11vw,6.5rem)] font-semibold tracking-tight text-foreground tabular-nums">
              {formatClockTime(displayedTimeMs, language)}
            </p>
            <p className="text-sm text-muted-foreground sm:text-base">
              {formatCalendarDate(displayedTimeMs, language)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 border-t pt-6 sm:grid-cols-2">
          <div className="space-y-2 text-left">
            <p className="text-sm text-muted-foreground">{messages.offset}</p>
            <p className="min-h-8 font-mono text-lg text-foreground tabular-nums sm:min-h-9 sm:text-2xl">
              {formatOffset(offsetMs, roundTripTimeMs, language)}
            </p>
          </div>

          <div className="space-y-2 text-left">
            <p className="text-sm text-muted-foreground">
              {messages.lastSyncedAt}
            </p>
            <p className="min-h-8 font-mono text-lg text-foreground tabular-nums sm:min-h-9 sm:text-2xl">
              {formatLastSyncedAt(lastSyncAtMs, language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentNetworkTimeClient
