import { useEffect, useLayoutEffect, useState } from "react"
import type { Destination } from "./types"
import { readingPosition } from "@workspace/ui/lib/reading-position"

export function ChapterFrame({
  html,
  title,
  size,
  wide,
  destination,
  onLink,
}: {
  html: string
  title: string
  size: number
  wide: boolean
  destination: Destination
  onLink: (href: string) => void
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  useEffect(() => {
    if (!doc) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const anchor = (event.target as Element)?.closest?.("[data-epub-href]")
      if (!anchor) return
      event.preventDefault()
      const href = anchor.getAttribute("data-epub-href")
      if (href) onLink(href)
    }
    function keydown(event: KeyboardEvent) {
      if (event.key === "Enter" && !event.defaultPrevented) {
        activate(event)
        return
      }
      if (event.key !== "Escape" || event.defaultPrevented) return
      const dialog = doc!.defaultView?.frameElement?.closest("dialog")
      if (dialog?.matches(":modal")) {
        event.preventDefault()
        dialog.requestClose()
      }
    }
    doc.addEventListener("click", activate)
    doc.addEventListener("keydown", keydown)
    return () => {
      doc.removeEventListener("click", activate)
      doc.removeEventListener("keydown", keydown)
    }
  }, [doc, onLink])
  useLayoutEffect(() => {
    if (!doc) return
    const position = readingPosition(doc)
    // Zoom also scales publisher fonts specified in absolute px/pt units.
    doc.documentElement.style.fontSize = "18px"
    doc.documentElement.style.zoom = String(size / 18)
    doc.body.style.maxWidth = wide ? "100ch" : "68ch"
    if (position) {
      const bounds = position.target.getBoundingClientRect()
      doc.defaultView?.scrollBy(
        bounds.left - position.left,
        bounds.top - position.top
      )
    }
  }, [doc, size, wide])
  useLayoutEffect(() => {
    if (!doc) return
    const anchor = destination.anchor?.(doc)
    if (anchor && typeof anchor !== "number" && "scrollIntoView" in anchor)
      anchor.scrollIntoView()
    else if (
      anchor &&
      typeof anchor !== "number" &&
      "getBoundingClientRect" in anchor
    )
      doc.defaultView?.scrollBy(0, anchor.getBoundingClientRect().top)
    else doc.defaultView?.scrollTo(0, 0)
  }, [doc, destination])
  // WebKit also blocks parent-owned event handlers without allow-scripts.
  // Chapter CSP forbids scripts; sanitized links cannot navigate the frame
  // to a new document that would lose that policy.
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
