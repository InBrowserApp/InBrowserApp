import { useEffect, useState } from "react"

function useRandomNumberGeneratorUi(outputText: string, hasResults: boolean) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (hasResults) {
      return
    }

    setIsFullscreen(false)
  }, [hasResults])

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen])

  useEffect(() => {
    if (outputText.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([outputText], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)
    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [outputText])

  return {
    downloadUrl,
    isFullscreen,
    openFullscreen() {
      if (hasResults) {
        setIsFullscreen(true)
      }
    },
    closeFullscreen() {
      setIsFullscreen(false)
    },
  }
}

export { useRandomNumberGeneratorUi }
