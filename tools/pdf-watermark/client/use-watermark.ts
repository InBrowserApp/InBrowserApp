import { useEffect, useState } from "react"
import { readImage, renderText } from "./watermark-image"
import type { Options, Watermark } from "../types"

function useWatermark(options: Options, file: File | null) {
  const { kind, text, font, color } = options
  const [state, setState] = useState<{
    key: string
    file: File | null
    mark: Watermark | null
    error: string
  }>({ key: "", file: null, mark: null, error: "" })
  const key = JSON.stringify([kind, text, font, color])
  useEffect(() => {
    let canceled = false
    const timer = setTimeout(() => {
      if (kind === "image" && !file) {
        setState({ key, file, mark: null, error: "" })
        return
      }
      const task =
        kind === "image" ? readImage(file!) : renderText({ text, font, color })
      task
        .then((mark) => {
          if (!canceled) setState({ key, file, mark, error: "" })
        })
        .catch((error) => {
          if (!canceled)
            setState({
              key,
              file,
              mark: null,
              error:
                error instanceof Error && error.message === "textError"
                  ? "textError"
                  : "imageError",
            })
        })
    }, 150)
    return () => {
      canceled = true
      clearTimeout(timer)
    }
  }, [kind, text, font, color, file, key])
  return state.key === key && state.file === file
    ? { ...state, preparing: false }
    : { mark: null, error: "", preparing: true }
}

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    if (!blob) {
      setUrl("")
      return
    }
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  return url
}

export { useWatermark, useObjectUrl }
