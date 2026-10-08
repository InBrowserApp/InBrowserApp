import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import type { Messages, Reader, ReaderState } from "./types"

const initial: ReaderState = {
  page: 1,
  total: 0,
  zoom: 100,
  current: 0,
  matches: 0,
  searching: false,
  query: "",
}

export function useReader(
  file: File | null,
  container: RefObject<HTMLDivElement | null>,
  messages: Messages
) {
  const reader = useRef<Reader | null>(null)
  const passwordCallback = useRef<((password: string) => void) | null>(null)
  const [state, setState] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [password, setPassword] = useState<"required" | "incorrect" | null>(
    null
  )

  useEffect(() => {
    setState(initial)
    setError("")
    setPassword(null)
    setLoading(false)
    if (!file || !container.current) return
    if (!file.name.toLowerCase().endsWith(".pdf") || file.size === 0) {
      setError(messages.invalid)
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(messages.tooLarge)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    setLoading(true)
    void import("./reader")
      .then(({ openReader }) => {
        signal.throwIfAborted()
        return openReader({
          file,
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((value) => ({ ...value, ...update }))
          },
          onPassword: (submit, incorrect) => {
            if (signal.aborted) return
            passwordCallback.current = submit
            setPassword(incorrect ? "incorrect" : "required")
          },
          onError: () => {
            if (!signal.aborted) setError(messages.invalid)
          },
        })
      })
      .then((instance) => {
        if (signal.aborted) {
          instance.dispose()
          return
        }
        reader.current = instance
        setLoading(false)
        setPassword(null)
        passwordCallback.current = null
      })
      .catch((reason: unknown) => {
        if (signal.aborted) return
        setError(
          reason instanceof Error && reason.message === "TOO_LARGE"
            ? messages.tooLarge
            : messages.invalid
        )
        setLoading(false)
        setPassword(null)
        controller.abort()
      })
    return () => {
      controller.abort()
      reader.current = null
      passwordCallback.current = null
    }
  }, [file, container, messages])

  return {
    state,
    loading,
    error,
    password,
    reader,
    submitPassword: (value: string) => {
      const submit = passwordCallback.current
      passwordCallback.current = null
      setPassword(null)
      submit?.(value)
    },
  }
}
