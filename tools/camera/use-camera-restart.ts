import { useEffect, useRef } from "react"

import type { CameraMode } from "./types"
import type { FacingMode } from "./browser-camera"

type UseCameraRestartOptions = Readonly<{
  facingMode: FacingMode
  hasStarted: boolean
  isRecording: boolean
  mode: CameraMode
  startCamera: () => Promise<void>
}>

function useCameraRestart({
  facingMode,
  hasStarted,
  isRecording,
  mode,
  startCamera,
}: UseCameraRestartOptions) {
  const previous = useRef({ facingMode, mode })

  useEffect(() => {
    const changed =
      previous.current.facingMode !== facingMode ||
      previous.current.mode !== mode
    previous.current = { facingMode, mode }
    if (!changed || !hasStarted || isRecording) return
    void startCamera()
  }, [facingMode, hasStarted, isRecording, mode, startCamera])
}

export { useCameraRestart }
