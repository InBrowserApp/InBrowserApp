import { buildDurationPartsFromPreset, clampTimePart } from "../core/timer"

import type { Dispatch, SetStateAction } from "react"
import type { TimerDurationParts } from "../core/timer"

type UseControlHandlersArgs = Readonly<{
  running: boolean
  setParts: Dispatch<SetStateAction<TimerDurationParts>>
  setNotificationEnabled: Dispatch<SetStateAction<boolean>>
  requestNotificationPermission: () => Promise<void>
}>

function useControlHandlers({
  running,
  setParts,
  setNotificationEnabled,
  requestNotificationPermission,
}: UseControlHandlersArgs) {
  function updateHours(value: number | null) {
    setParts((currentParts) => ({
      ...currentParts,
      hours: clampTimePart(value),
    }))
  }

  function updateMinutes(value: number | null) {
    setParts((currentParts) => ({
      ...currentParts,
      minutes: clampTimePart(value, 59),
    }))
  }

  function updateSeconds(value: number | null) {
    setParts((currentParts) => ({
      ...currentParts,
      seconds: clampTimePart(value, 59),
    }))
  }

  function handlePreset(presetMinutes: number) {
    if (!running) {
      setParts(buildDurationPartsFromPreset(presetMinutes))
    }
  }

  function handleNotificationChange(checked: boolean) {
    setNotificationEnabled(checked)

    if (checked) {
      void requestNotificationPermission()
    }
  }

  return {
    updateHours,
    updateMinutes,
    updateSeconds,
    handlePreset,
    handleNotificationChange,
  }
}

export { useControlHandlers }
