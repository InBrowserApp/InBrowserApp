import { useEffect, useState } from "react"

function useObjectUrl(blob: Blob | null) {
  const [objectUrl, setObjectUrl] = useState<{
    blob: Blob
    url: string
  } | null>(null)

  useEffect(() => {
    if (!blob) {
      setObjectUrl(null)
      return
    }

    const nextObjectUrl = URL.createObjectURL(blob)
    setObjectUrl({ blob, url: nextObjectUrl })

    return () => {
      URL.revokeObjectURL(nextObjectUrl)
    }
  }, [blob])

  return objectUrl?.blob === blob ? objectUrl.url : null
}

export { useObjectUrl }
