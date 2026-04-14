import { useEffect, useState } from "react"

function useRandomPasswordGeneratorUi(outputText: string, hasResult: boolean) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isResultHidden, setIsResultHidden] = useState(true)

  useEffect(() => {
    if (hasResult) {
      return
    }

    setIsResultHidden(true)
  }, [hasResult])

  useEffect(() => {
    if (!outputText) {
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
    isResultHidden,
    toggleResultHidden() {
      if (hasResult) {
        setIsResultHidden((value) => !value)
      }
    },
  }
}

export { useRandomPasswordGeneratorUi }
