import { useEffect, useLayoutEffect, useState } from "react"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"

export function MessageFrame({
  html,
  title,
  size,
}: {
  html: string
  title: string
  size: number
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const { preserve } = useReadingPosition(doc)
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      doc.documentElement.style.zoom = String(size / 16)
    })
  }, [doc, size, preserve])
  useEffect(() => {
    if (!doc) return
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      const dialog = doc!.defaultView?.frameElement?.closest("dialog")
      if (dialog?.matches(":modal")) {
        event.preventDefault()
        dialog.requestClose()
      }
    }
    doc.addEventListener("keydown", escape)
    return () => doc.removeEventListener("keydown", escape)
  }, [doc])
  // WebKit blocks parent-owned key listeners without allow-scripts.
  // The sanitized document has a first-in-head script-src none CSP and no
  // navigable links, forms or refreshes that could replace it and lose the CSP.
  return (
    <iframe
      title={title}
      sandbox="allow-same-origin allow-scripts"
      srcDoc={html}
      className="h-full min-h-0 w-full border-0 bg-white"
      onLoad={(event) => setDoc(event.currentTarget.contentDocument)}
    />
  )
}
