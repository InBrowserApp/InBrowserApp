import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"

export function DocumentDownload({
  file,
  filename,
  label,
  focusOnReady,
}: {
  file: Blob
  filename: string
  label: string
  focusOnReady?: boolean
}) {
  const link = useRef<HTMLAnchorElement>(null)
  const [resource, setResource] = useState<{ file: Blob; url: string } | null>(
    null
  )
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setResource({ file, url })
    return () => URL.revokeObjectURL(url)
  }, [file])
  useEffect(() => {
    if (
      focusOnReady &&
      resource?.file === file &&
      document.activeElement === document.body
    ) {
      link.current?.focus({ preventScroll: true })
    }
  }, [file, focusOnReady, resource])
  if (resource?.file !== file) return null
  return (
    <Button asChild>
      <a
        ref={link}
        href={resource.url}
        download={filename}
        data-astro-prefetch="false"
      >
        <Download data-icon="inline-start" aria-hidden="true" />
        {label}
      </a>
    </Button>
  )
}
