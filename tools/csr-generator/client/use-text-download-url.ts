import { useEffect, useState } from "react"

function useTextDownloadUrl(value: string, type: string) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(new Blob([value], { type }))
    setUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [type, value])

  return url
}

export { useTextDownloadUrl }
