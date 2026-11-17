import { useEffect, useState } from "react"
import type {
  CapabilityRequest,
  CapabilityResponse,
  NativeSupport,
} from "../types"

const UNAVAILABLE: NativeSupport = {
  m4a: false,
  webm: false,
  mp3: false,
  ogg: false,
}

export function useNativeSupport({ channels, quality }: CapabilityRequest) {
  const [support, setSupport] = useState<NativeSupport | null>(null)
  useEffect(() => {
    let worker: Worker | undefined
    let active = true
    setSupport(null)
    try {
      worker = new Worker(new URL("../workers/encode.ts", import.meta.url), {
        type: "module",
      })
      worker.onmessage = (event: MessageEvent<CapabilityResponse>) => {
        if (active) setSupport(event.data.capabilities)
        worker?.terminate()
      }
      worker.onerror = () => {
        if (active) setSupport(UNAVAILABLE)
        worker?.terminate()
      }
      worker.postMessage({ channels, quality } satisfies CapabilityRequest)
    } catch {
      setSupport(UNAVAILABLE)
    }
    return () => {
      active = false
      worker?.terminate()
    }
  }, [channels, quality])
  return support
}
