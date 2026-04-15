import { useEffect, useState } from "react"

import { STORAGE_KEYS, loadPersistedTimerState } from "./storage"
import { buildDurationMs } from "../core/timer"

import type { Dispatch, SetStateAction } from "react"
import type { TimerDurationParts } from "../core/timer"

type UseTimerStorageArgs = Readonly<{
  parts: TimerDurationParts
  running: boolean
  remainingMs: number
  endTime: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  notificationEnabled: boolean
  setParts: Dispatch<SetStateAction<TimerDurationParts>>
  setRunning: Dispatch<SetStateAction<boolean>>
  setRemainingMs: Dispatch<SetStateAction<number>>
  setEndTime: Dispatch<SetStateAction<number>>
  setSoundEnabled: Dispatch<SetStateAction<boolean>>
  setVibrationEnabled: Dispatch<SetStateAction<boolean>>
  setNotificationEnabled: Dispatch<SetStateAction<boolean>>
  setNowMs: Dispatch<SetStateAction<number>>
}>

function useTimerStorage({
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
}: UseTimerStorageArgs) {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const restoredState = loadPersistedTimerState()
    const restoredDurationMs = buildDurationMs(restoredState.parts)
    const nextRemainingMs =
      !restoredState.running &&
      restoredState.remainingMs === 0 &&
      restoredDurationMs > 0
        ? restoredDurationMs
        : restoredState.remainingMs

    setParts(restoredState.parts)
    setRunning(restoredState.running)
    setRemainingMs(nextRemainingMs)
    setEndTime(restoredState.endTime)
    setSoundEnabled(restoredState.soundEnabled)
    setVibrationEnabled(restoredState.vibrationEnabled)
    setNotificationEnabled(restoredState.notificationEnabled)
    setNowMs(Date.now())
    setHasHydrated(true)
  }, [
    setEndTime,
    setNotificationEnabled,
    setNowMs,
    setParts,
    setRemainingMs,
    setRunning,
    setSoundEnabled,
    setVibrationEnabled,
  ])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.hours, String(parts.hours))
    window.localStorage.setItem(STORAGE_KEYS.minutes, String(parts.minutes))
    window.localStorage.setItem(STORAGE_KEYS.seconds, String(parts.seconds))
    window.localStorage.setItem(STORAGE_KEYS.running, String(running))
    window.localStorage.setItem(STORAGE_KEYS.remainingMs, String(remainingMs))
    window.localStorage.setItem(STORAGE_KEYS.endTime, String(endTime))
    window.localStorage.setItem(STORAGE_KEYS.soundEnabled, String(soundEnabled))
    window.localStorage.setItem(
      STORAGE_KEYS.vibrationEnabled,
      String(vibrationEnabled)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.notificationEnabled,
      String(notificationEnabled)
    )
  }, [
    endTime,
    hasHydrated,
    notificationEnabled,
    parts.hours,
    parts.minutes,
    parts.seconds,
    remainingMs,
    running,
    soundEnabled,
    vibrationEnabled,
  ])

  return hasHydrated
}

export { useTimerStorage }
