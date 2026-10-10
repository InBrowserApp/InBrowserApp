import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"

export function DocumentDownload({
  file,
  filename,
  label,
}: {
  file: Blob
  filename: string
  label: string
}) {
  const [resource, setResource] = useState<{ file: Blob; url: string } | null>(
    null
  )
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setResource({ file, url })
    return () => URL.revokeObjectURL(url)
  }, [file])
  if (resource?.file !== file) return null
  return (
    <Button asChild>
      <a href={resource.url} download={filename} data-astro-prefetch="false">
        <Download data-icon="inline-start" aria-hidden="true" />
        {label}
      </a>
    </Button>
  )
}
