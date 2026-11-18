import { useEffect, useRef, useState } from "react"
import type { ImageSource } from "./types"

export function useImageSource() {
  const [image, setImage] = useState<ImageSource | null>(null)
  const [status, setStatus] = useState<"loading" | "error" | "idle">("idle")
  const pending = useRef<AbortController | null>(null)
  const nextId = useRef(0)

  useEffect(() => () => pending.current?.abort(), [])
  useEffect(() => () => image?.bitmap.close(), [image])

  async function open(file: File) {
    pending.current?.abort()
    const request = new AbortController()
    const id = ++nextId.current
    pending.current = request
    setStatus("loading")
    try {
      const bitmap = await createImageBitmap(file)
      if (request.signal.aborted) {
        bitmap.close()
        return
      }
      setImage({ id, file, bitmap })
      setStatus("idle")
    } catch {
      if (!request.signal.aborted) setStatus("error")
    }
  }

  return { image, status, open }
}
