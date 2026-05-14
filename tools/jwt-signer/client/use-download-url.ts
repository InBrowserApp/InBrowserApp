import { useEffect, useRef, useState } from "react"

import type { SignJwtResult } from "../core/jwt-signer"

function useDownloadUrl(result: SignJwtResult | null) {
  const downloadUrlRef = useRef<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!result) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([`${result.token}\n`], { type: "text/plain;charset=utf-8" })
    )
    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [result])

  return downloadUrl
}

export { useDownloadUrl }
