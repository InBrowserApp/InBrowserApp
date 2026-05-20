import { useEffect, useState } from "react"

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (!blob) {
      setUrl("")
      return
    }

    const nextUrl = URL.createObjectURL(blob)
    setUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [blob])

  return url
}

export { useObjectUrl }
