import { useEffect, useLayoutEffect, useState } from "react"
import { readingPosition } from "@workspace/ui/lib/reading-position"

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
        anchor.closest("details")?.setAttribute("open", "")
        anchor.scrollIntoView()
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
  }, [doc, onMissing])
  useLayoutEffect(() => {
    if (!doc) return
    const position = readingPosition(doc)
    doc.documentElement.style.zoom = String(zoom / 100)
    if (position) {
      const bounds = position.target.getBoundingClientRect()
      doc.defaultView?.scrollBy(
        bounds.left - position.left,
        bounds.top - position.top
      )
    }
  }, [doc, zoom])
  useLayoutEffect(() => {
    if (!target || !doc) return
    doc.getElementById(target.id)?.scrollIntoView()
    ;(doc.defaultView?.frameElement as HTMLElement | null)?.focus()
  }, [doc, target])
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
