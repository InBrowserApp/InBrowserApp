import { useEffect, useLayoutEffect, useState } from "react"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"
import { scrollReadingTarget } from "@workspace/ui/lib/scroll-reading-target"

export function DocumentFrame({
  html,
  title,
  zoom,
  target,
  onMissing,
}: {
  html: string
  title: string
  zoom: number
  target: { id: string } | null
  onMissing: () => void
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const { preserve, navigate } = useReadingPosition(doc)
  useEffect(() => {
    if (!doc) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const link = (event.target as Element)?.closest?.("[data-odt-reference]")
      if (!link) return
      event.preventDefault()
      let id = link.getAttribute("data-odt-reference")!
      try {
        id = decodeURIComponent(id)
      } catch {
        /* Use the literal bookmark. */
      }
      const anchor = doc!.getElementById(id)
      if (anchor) {
        navigate(() => {
          anchor.closest("details")?.setAttribute("open", "")
          scrollReadingTarget(doc!, anchor)
        })
      } else onMissing()
    }
    function keydown(event: KeyboardEvent) {
      if (event.key === "Enter" && !event.defaultPrevented) activate(event)
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
  }, [doc, onMissing, navigate])
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      doc.documentElement.style.zoom = String(zoom / 100)
    })
  }, [doc, zoom, preserve])
  useLayoutEffect(() => {
    if (!target || !doc) return
    navigate(() => scrollReadingTarget(doc, doc.getElementById(target.id)))
    ;(doc.defaultView?.frameElement as HTMLElement | null)?.focus({
      preventScroll: true,
    })
  }, [doc, target, navigate])
  // WebKit requires allow-scripts for trusted parent key handlers. The first
  // head CSP blocks all scripts; sanitization removes every navigation path.
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
