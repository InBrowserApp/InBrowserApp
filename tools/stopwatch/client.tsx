import { useEffect, useEffectEvent, useMemo, useState } from "react"

import { StopwatchCard } from "./components/stopwatch-card"
import { LapsCard } from "./components/laps-card"
import { formatStopwatch } from "./core/format"
import { STORAGE_KEYS, loadPersistedStopwatchState } from "./client/storage"

import type { StopwatchClientProps } from "./types"

const TICK_INTERVAL_MS = 50

function StopwatchClient({ messages }: StopwatchClientProps) {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [running, setRunning] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [accumulatedMs, setAccumulatedMs] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const [nowMs, setNowMs] = useState(() => Date.now())

  const tickNow = useEffectEvent(() => {
    setNowMs(Date.now())
  })

  useEffect(() => {
    const restoredState = loadPersistedStopwatchState()

    setRunning(restoredState.running)
    setStartTime(restoredState.startTime)
    setAccumulatedMs(restoredState.accumulatedMs)
    setLaps(restoredState.laps)
    setNowMs(Date.now())
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.running, String(running))
    window.localStorage.setItem(STORAGE_KEYS.startTime, String(startTime))
    window.localStorage.setItem(
      STORAGE_KEYS.accumulatedMs,
      String(accumulatedMs)
    )
    window.localStorage.setItem(STORAGE_KEYS.laps, JSON.stringify(laps))
  }, [accumulatedMs, hasHydrated, laps, running, startTime])

  useEffect(() => {
    if (!running) {
      return
    }

    tickNow()

    const intervalId = window.setInterval(() => {
      tickNow()
    }, TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [running])

  const elapsedMs = useMemo(() => {
    if (!running) {
      return accumulatedMs
    }

    return accumulatedMs + Math.max(0, nowMs - startTime)
  }, [accumulatedMs, nowMs, running, startTime])
  const formattedElapsed = useMemo(
    () => formatStopwatch(elapsedMs),
    [elapsedMs]
  )
  const hasElapsed = elapsedMs > 0
  const canLap = running && hasElapsed
  const canReset = !running && (hasElapsed || laps.length > 0)

  function captureNow() {
    const currentTime = Date.now()

    setNowMs(currentTime)

    return currentTime
  }

  function handleStart() {
    if (running) {
      return
    }

    const currentTime = captureNow()

    setStartTime(currentTime)
    setRunning(true)
  }

  function handlePause() {
    if (!running) {
      return
    }

    const currentTime = captureNow()
    const nextAccumulatedMs = accumulatedMs + (currentTime - startTime)

    setAccumulatedMs(nextAccumulatedMs)
    setRunning(false)
  }

  function handleLap() {
    if (!canLap) {
      return
    }

    const currentTime = captureNow()
    const lapTotalMs = accumulatedMs + (currentTime - startTime)

    setLaps((currentLaps) => [...currentLaps, lapTotalMs])
  }

  function handleReset() {
    setRunning(false)
    setStartTime(0)
    setAccumulatedMs(0)
    setLaps([])
    captureNow()
  }

  return (
    <div className="grid gap-6">
      <StopwatchCard
        messages={messages}
        formattedElapsed={formattedElapsed}
        running={running}
        hasElapsed={hasElapsed}
        canLap={canLap}
        canReset={canReset}
        onStart={handleStart}
        onPause={handlePause}
        onLap={handleLap}
        onReset={handleReset}
      />

      <LapsCard
        messages={messages}
        laps={laps}
        onClear={() => {
          setLaps([])
        }}
      />
    </div>
  )
}

export default StopwatchClient
