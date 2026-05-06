import { useEffect, useState } from "react"

const useObjectUrl = (value: string, type: string): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (value.length === 0) {
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

export { useObjectUrl }
