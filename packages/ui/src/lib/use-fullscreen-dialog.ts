import { useEffect, useRef } from "react"

import type { SyntheticEvent } from "react"

export function useFullscreenDialog() {
  const dialog = useRef<HTMLDialogElement>(null)
  const surface = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let wasFullscreen = false
    function onFullscreenChange() {
      const isFullscreen = document.fullscreenElement === surface.current
      if (wasFullscreen && !isFullscreen) dialog.current?.close()
      wasFullscreen = isFullscreen
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  function open(opener: HTMLButtonElement) {
    opener.focus()
    dialog.current?.showModal()
    // The dialog fills the viewport when native fullscreen is unavailable.
    void surface.current?.requestFullscreen?.().catch(() => {})
  }

  function close() {
    if (document.fullscreenElement === surface.current) {
      // Close after leaving native fullscreen so focus can return to the opener.
      void document.exitFullscreen()
    } else {
      dialog.current?.close()
    }
  }

  function cancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault()
    close()
  }

  return { dialog, surface, open, close, cancel }
}
