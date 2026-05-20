import { useEffect, useState } from "react"

function useObjectUrl(blob: Blob | null) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setObjectUrl(null)
      return
    }

    const nextObjectUrl = URL.createObjectURL(blob)
    setObjectUrl(nextObjectUrl)

    return () => {
      URL.revokeObjectURL(nextObjectUrl)
    }
  }, [blob])

  return objectUrl
}

export { useObjectUrl }
