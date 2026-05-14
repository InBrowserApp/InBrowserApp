import { useEffect, useState } from "react"

import { getCurrentUnixSeconds } from "../payload-claims"

function useUnixSecondClock(enabled: boolean) {
  const [nowSeconds, setNowSeconds] = useState<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    setNowSeconds(getCurrentUnixSeconds())

    const intervalId = window.setInterval(() => {
      setNowSeconds(getCurrentUnixSeconds())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [enabled])

  return nowSeconds
}

export { useUnixSecondClock }
