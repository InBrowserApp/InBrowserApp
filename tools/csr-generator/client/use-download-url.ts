import { useEffect, useState } from "react"

function useDownloadUrl(value: string, type: string) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (!value) {
      setUrl("")
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

export { useDownloadUrl }
