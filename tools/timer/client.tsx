import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react"

import { AlertsCard } from "./components/alerts-card"
import { DurationCard } from "./components/duration-card"
import { FullscreenOverlay } from "./components/fullscreen-overlay"
import { TimerCard } from "./components/timer-card"
import { useControlHandlers } from "./client/use-control-handlers"
import { useFullscreenState } from "./client/use-fullscreen-state"
import { useTimerAlerts } from "./client/use-timer-alerts"
import { useTimerStorage } from "./client/use-timer-storage"
import { formatCountdown } from "./core/format"
import {
  buildDurationMs,
  getCanReset,
  getDisplayRemainingMs,
  getRunMode,
  normalizeDurationParts,
} from "./core/timer"

import type { TimerClientProps } from "./types"

const PRESET_MINUTES = [1, 5, 10, 25, 30, 60] as const
const TICK_INTERVAL_MS = 50

function TimerClient({ messages }: TimerClientProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const hasAppliedInitialDurationRef = useRef(false)

  const [parts, setParts] = useState(() =>
    normalizeDurationParts({
      hours: 0,
      minutes: 5,
      seconds: 0,
    })
  )
  const [running, setRunning] = useState(false)
  const [remainingMs, setRemainingMs] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [errorMessage, setErrorMessage] = useState("")

  const hasHydrated = useTimerStorage({
    parts,
    running,
    remainingMs,
    endTime,
    soundEnabled,
    vibrationEnabled,
    notificationEnabled,
    setParts,
    setRunning,
    setRemainingMs,
    setEndTime,
    setSoundEnabled,
    setVibrationEnabled,
    setNotificationEnabled,
    setNowMs,
  })
  const {
    soundSupported,
    vibrationSupported,
    notificationSupported,
    notificationHint,
    showNotificationRequestButton,
    unlockAudio,
    requestNotificationPermission,
    notifyTimerComplete,
  } = useTimerAlerts({
    messages,
    soundEnabled,
    vibrationEnabled,
    notificationEnabled,
  })
  const { isFullscreenActive, handleEnterFullscreen, handleExitFullscreen } =
    useFullscreenState({
      rootRef,
    })
  const {
    updateHours,
    updateMinutes,
    updateSeconds,
    handlePreset,
    handleNotificationChange,
  } = useControlHandlers({
    running,
    setParts,
    setNotificationEnabled,
    requestNotificationPermission,
  })

  const durationMs = useMemo(() => buildDurationMs(parts), [parts])
  const displayRemainingMs = useMemo(
    () =>
      getDisplayRemainingMs({
        running,
        remainingMs,
        endTime,
        nowMs,
      }),
    [endTime, nowMs, remainingMs, running]
  )
  const formattedRemaining = useMemo(
    () => formatCountdown(displayRemainingMs),
    [displayRemainingMs]
  )
  const runMode = useMemo(
    () =>
      getRunMode({
        running,
        displayRemainingMs,
        durationMs,
      }),
    [displayRemainingMs, durationMs, running]
  )
  const runLabel = useMemo(
    () =>
      runMode === "pause"
        ? messages.pauseLabel
        : runMode === "resume"
          ? messages.resumeLabel
          : messages.startLabel,
    [messages.pauseLabel, messages.resumeLabel, messages.startLabel, runMode]
  )
  const canReset = useMemo(
    () =>
      getCanReset({
        running,
        displayRemainingMs,
        durationMs,
      }),
    [displayRemainingMs, durationMs, running]
  )

  const tickNow = useEffectEvent(() => {
    setNowMs(Date.now())
  })

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

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (!hasAppliedInitialDurationRef.current) {
      hasAppliedInitialDurationRef.current = true
      return
    }

    setRemainingMs(durationMs)

    if (durationMs > 0) {
      setErrorMessage("")
    }
  }, [durationMs, hasHydrated])

  const completeTimer = useEffectEvent((notify: boolean) => {
    setRunning(false)
    setEndTime(0)
    setRemainingMs(0)
    setNowMs(Date.now())

    if (notify) {
      notifyTimerComplete()
    }
  })

  useEffect(() => {
    if (!hasHydrated || !running) {
      return
    }

    if (endTime === 0) {
      setRunning(false)
      return
    }

    if (endTime <= Date.now()) {
      completeTimer(false)
    }
  }, [endTime, hasHydrated, running])

  useEffect(() => {
    if (!running || displayRemainingMs > 0) {
      return
    }

    completeTimer(true)
  }, [displayRemainingMs, running])

  async function handleStart() {
    if (running) {
      return
    }

    setErrorMessage("")

    if (durationMs <= 0) {
      setErrorMessage(messages.errorNoDurationLabel)
      return
    }

    const currentTime = Date.now()
    const targetRemaining =
      displayRemainingMs === 0 ? durationMs : displayRemainingMs

    await unlockAudio()

    setNowMs(currentTime)
    setRemainingMs(targetRemaining)
    setEndTime(currentTime + targetRemaining)
    setRunning(true)
  }

  function handlePause() {
    if (!running) {
      return
    }

    const currentTime = Date.now()

    setNowMs(currentTime)
    setRemainingMs(
      getDisplayRemainingMs({
        running: true,
        remainingMs,
        endTime,
        nowMs: currentTime,
      })
    )
    setRunning(false)
    setEndTime(0)
  }

  async function handleToggleRun() {
    if (running) {
      handlePause()
      return
    }

    await handleStart()
  }

  function handleReset() {
    setRunning(false)
    setEndTime(0)
    setRemainingMs(durationMs)
    setErrorMessage("")
    setNowMs(Date.now())
  }

  return (
    <div ref={rootRef} className="grid gap-6">
      <TimerCard
        messages={messages}
        formattedRemaining={formattedRemaining}
        running={running}
        runLabel={runLabel}
        canReset={canReset}
        errorMessage={errorMessage}
        onToggleRun={() => void handleToggleRun()}
        onReset={handleReset}
        onEnterFullscreen={() => void handleEnterFullscreen()}
      />

      {!isFullscreenActive ? (
        <>
          <DurationCard
            messages={messages}
            parts={parts}
            running={running}
            presetMinutes={PRESET_MINUTES}
            onHoursChange={updateHours}
            onMinutesChange={updateMinutes}
            onSecondsChange={updateSeconds}
            onPreset={handlePreset}
          />

          <AlertsCard
            messages={messages}
            soundEnabled={soundEnabled}
            vibrationEnabled={vibrationEnabled}
            notificationEnabled={notificationEnabled}
            soundSupported={soundSupported}
            vibrationSupported={vibrationSupported}
            notificationSupported={notificationSupported}
            notificationHint={notificationHint}
            showNotificationRequestButton={showNotificationRequestButton}
            onSoundChange={setSoundEnabled}
            onVibrationChange={setVibrationEnabled}
            onNotificationChange={handleNotificationChange}
            onRequestNotificationPermission={() =>
              void requestNotificationPermission()
            }
          />
        </>
      ) : null}

      {isFullscreenActive ? (
        <FullscreenOverlay
          formattedRemaining={formattedRemaining}
          running={running}
          runLabel={runLabel}
          resetLabel={messages.resetLabel}
          exitLabel={messages.fullscreenExitLabel}
          canReset={canReset}
          onToggleRun={() => void handleToggleRun()}
          onReset={handleReset}
          onExit={() => void handleExitFullscreen()}
        />
      ) : null}
    </div>
  )
}

export default TimerClient
