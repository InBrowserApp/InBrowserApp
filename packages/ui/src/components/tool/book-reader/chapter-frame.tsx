import { useEffect, useLayoutEffect, useState } from "react"
import type { Destination } from "@workspace/ui/lib/book-reader"
import {
  captureReadingLocation,
  restoreReadingLocation,
  type ReadingLocation,
} from "@workspace/ui/lib/reading-location"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"
import { scrollReadingTarget } from "@workspace/ui/lib/scroll-reading-target"

export function ChapterFrame({
  html,
  title,
  size,
  wide,
  destination,
  onLink,
  onResourceError,
}: {
  html: string
  title: string
  size: number
  wide: boolean
  destination: Destination
  onLink: (href: string, position: ReadingLocation) => void
  onResourceError: () => void
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const { preserve, navigate } = useReadingPosition(doc)
  useEffect(() => {
    if (!doc) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const anchor = (event.target as Element)?.closest?.("[data-epub-href]")
      if (!anchor) return
      event.preventDefault()
      const href = anchor.getAttribute("data-epub-href")
      if (href) onLink(href, captureReadingLocation(doc!))
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
    function failed(event: Event) {
      const target = event.target as Element
      if (target?.localName === "img" && target.getAttribute("src"))
        onResourceError()
    }
    if (
      Array.from(doc.images).some(
        (image) =>
          image.getAttribute("src") && image.complete && !image.naturalWidth
      )
    )
      onResourceError()
    doc.addEventListener("error", failed, true)
    doc.addEventListener("click", activate)
    doc.addEventListener("keydown", keydown)
    return () => {
      doc.removeEventListener("error", failed, true)
      doc.removeEventListener("click", activate)
      doc.removeEventListener("keydown", keydown)
    }
  }, [doc, onLink, onResourceError])
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      // Zoom also scales publisher fonts specified in absolute px/pt units.
      doc.documentElement.style.fontSize = "18px"
      doc.documentElement.style.zoom = String(size / 18)
      doc.body.style.maxWidth = wide ? "100ch" : "68ch"
    })
  }, [doc, size, wide, preserve])
  useLayoutEffect(() => {
    if (!doc) return
    navigate(() => {
      if (destination.position) {
        restoreReadingLocation(doc, destination.position)
        ;(doc.defaultView?.frameElement as HTMLElement | null)?.focus({
          preventScroll: true,
        })
        return
      }
      const anchor = destination.anchor?.(doc)
      if (anchor && typeof anchor !== "number") scrollReadingTarget(doc, anchor)
      else doc.defaultView?.scrollTo(0, 0)
    })
  }, [doc, destination, navigate])
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
