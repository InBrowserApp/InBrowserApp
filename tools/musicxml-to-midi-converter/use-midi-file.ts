import { useEffect, useRef } from "react"
import type { ConversionResult } from "./midi.worker"

export function useMidiFile(input: File) {
  const cancel = useRef<(() => void) | null>(null)
  const result = useRef<Promise<File> | null>(null)

  useEffect(() => () => cancel.current?.(), [])

  return function readMidi() {
    if (result.current) return result.current

    const worker = new Worker(new URL("./midi.worker.ts", import.meta.url), {
      type: "module",
    })
    const conversion = new Promise<File>((resolve, reject) => {
      function fail() {
        if (cancel.current !== fail) return
        worker.terminate()
        cancel.current = null
        result.current = null
        reject(new Error("MusicXML conversion did not finish"))
      }
      cancel.current = fail
      worker.onerror = fail
      worker.onmessageerror = fail
      worker.onmessage = ({ data }: MessageEvent<ConversionResult>) => {
        if (cancel.current !== fail) return
        if ("error" in data) {
          fail()
          return
        }
        worker.terminate()
        cancel.current = null
        resolve(data.file)
      }
    })
    result.current = conversion
    try {
      worker.postMessage(input)
    } catch {
      cancel.current?.()
    }
    return conversion
  }
}
