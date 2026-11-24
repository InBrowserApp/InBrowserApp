import { useEffect, useRef, useState } from "react"

import type { Scale, UpscaleRequest, UpscaleUpdate } from "./worker-messages"

type Source = { file: File; url: string; width: number; height: number }
type Result = { url: string; scale: Scale }
type Progress = "loading" | number
type UpscaleError = "invalidImage" | "largeImage" | "failed"

export function useUpscaler() {
  const [scale, setScale] = useState<Scale>(2)
  const [source, setSource] = useState<Source>()
  const [result, setResult] = useState<Result>()
  const [progress, setProgress] = useState<Progress>()
  const [error, setError] = useState<UpscaleError>()
  const selection = useRef(0)
  const worker = useRef<Worker | null>(null)

  const sourceUrl = source?.url
  const resultUrl = result?.url

  useEffect(
    () => () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    },
    [sourceUrl]
  )
  useEffect(
    () => () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    },
    [resultUrl]
  )
  useEffect(
    () => () => {
      selection.current++
      worker.current?.terminate()
      worker.current = null
    },
    []
  )

  function cancel() {
    worker.current?.terminate()
    worker.current = null
    setProgress(undefined)
  }

  async function chooseFile(file: File) {
    const id = ++selection.current
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.src = url
    try {
      await image.decode()
      if (id === selection.current) {
        const { naturalWidth: width, naturalHeight: height } = image
        if (Math.max(width, height) <= 2048 && width * height <= 1_000_000) {
          cancel()
          setSource({ file, url, width, height })
          setResult(undefined)
          setError(undefined)
          return
        }
        setError("largeImage")
      }
    } catch {
      if (id === selection.current) setError("invalidImage")
    }
    URL.revokeObjectURL(url)
  }

  function upscale() {
    if (!source) return

    setError(undefined)
    setProgress("loading")

    const fail = () => {
      cancel()
      setError("failed")
    }

    try {
      const activeWorker =
        worker.current ??
        new Worker(new URL("./workers/upscale.worker.ts", import.meta.url), {
          type: "module",
        })
      worker.current = activeWorker
      activeWorker.onmessage = ({ data }: MessageEvent<UpscaleUpdate>) => {
        if (activeWorker !== worker.current) return

        switch (data.type) {
          case "loading":
            setProgress("loading")
            break
          case "progress":
            setProgress(data.fraction)
            break
          case "done":
            setResult({ url: URL.createObjectURL(data.png), scale })
            setProgress(undefined)
            break
          case "failed":
            fail()
        }
      }
      activeWorker.onerror = () => {
        if (activeWorker === worker.current) fail()
      }
      activeWorker.postMessage({
        file: source.file,
        scale,
      } satisfies UpscaleRequest)
    } catch {
      fail()
    }
  }

  return {
    source,
    result: result?.scale === scale ? result : undefined,
    scale,
    progress,
    error,
    setScale,
    chooseFile,
    upscale,
    cancel,
  }
}
