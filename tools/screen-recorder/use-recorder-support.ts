import { useEffect, useState } from "react"

import { detectScreenRecorderSupport } from "./browser-recorder"

import type { ScreenRecorderSupport } from "./browser-recorder"
import type { SupportStatus } from "./types"

const initialSupport: ScreenRecorderSupport = {
  screen: false,
  microphone: false,
  recorder: false,
}

function useRecorderSupport() {
  const [supportStatus, setSupportStatus] = useState<SupportStatus>("checking")
  const [support, setSupport] = useState<ScreenRecorderSupport>(initialSupport)

  useEffect(() => {
    const nextSupport = detectScreenRecorderSupport()
    setSupport(nextSupport)
    setSupportStatus(
      nextSupport.screen && nextSupport.recorder ? "supported" : "unsupported"
    )
  }, [])

  return {
    isSupported: supportStatus === "supported",
    support,
    supportStatus,
  }
}

export { useRecorderSupport }
