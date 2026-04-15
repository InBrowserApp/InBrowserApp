import { useEffect, useState } from "react"

import type { RefObject } from "react"

type UseFullscreenStateArgs = Readonly<{
  rootRef: RefObject<HTMLDivElement | null>
}>

function useFullscreenState({ rootRef }: UseFullscreenStateArgs) {
  const [nativeFullscreenActive, setNativeFullscreenActive] = useState(false)
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setNativeFullscreenActive(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (!pseudoFullscreen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [pseudoFullscreen])

  async function handleEnterFullscreen() {
    const element = rootRef.current

    if (element && typeof element.requestFullscreen === "function") {
      try {
        await element.requestFullscreen()
        return
      } catch {
        // Fall back to a fixed overlay when native fullscreen fails.
      }
    }

    setPseudoFullscreen(true)
  }

  async function handleExitFullscreen() {
    if (
      document.fullscreenElement &&
      typeof document.exitFullscreen === "function"
    ) {
      try {
        await document.exitFullscreen()
        return
      } catch {
        // Fall back to clearing the pseudo fullscreen state.
      }
    }

    setPseudoFullscreen(false)
  }

  return {
    isFullscreenActive: nativeFullscreenActive || pseudoFullscreen,
    handleEnterFullscreen,
    handleExitFullscreen,
  }
}

export { useFullscreenState }
