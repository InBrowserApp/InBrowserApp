import { useEffect, useState } from "react"

function useToolResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setError(false)
    load().then(
      (result) => {
        if (active) setData(result)
      },
      () => {
        if (active) setError(true)
      }
    )
    return () => {
      active = false
    }
  }, [load, attempt])

  return {
    data,
    error,
    loading: data === null && !error,
    retry: () => setAttempt((value) => value + 1),
  }
}

export { useToolResource }
