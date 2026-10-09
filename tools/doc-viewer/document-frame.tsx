import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { readingPosition } from "@workspace/ui/lib/reading-position"

export function DocumentFrame({
  html,
  title,
  zoom,
  target,
  onMissing,
  onPosition,
}: {
  html: string
  title: string
  zoom: number
  target: { id: string } | null
  onMissing: () => void
  onPosition: (value: number) => void
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const anchor = useRef<ReturnType<typeof readingPosition>>(null)
  useEffect(() => {
    if (!doc) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const link = (event.target as Element)?.closest?.("[data-doc-reference]")
      if (!link) return
      event.preventDefault()
      let id = link.getAttribute("data-doc-reference")!
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
  useEffect(() => {
    if (!doc?.defaultView) return
    const view = doc.defaultView
    const update = () => {
      const extent = doc.documentElement.scrollHeight - view.innerHeight
      onPosition(
        extent > 0
          ? Math.round(
              Math.min(100, Math.max(0, (view.scrollY / extent) * 100))
            )
          : 100
      )
    }
    const remember = () => {
      if (view.innerWidth > 0) anchor.current = readingPosition(doc)
      update()
    }
    const resize = () => {
      if (view.innerWidth <= 0) return
      const position = anchor.current
      if (position) {
        const bounds = position.target.getBoundingClientRect()
        view.scrollBy(bounds.left - position.left, bounds.top - position.top)
      }
      remember()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(doc.body)
    view.addEventListener("scroll", remember, { passive: true })
    view.addEventListener("resize", resize)
    remember()
    return () => {
      observer.disconnect()
      view.removeEventListener("scroll", remember)
      view.removeEventListener("resize", resize)
    }
  }, [doc, onPosition])
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
    anchor.current = readingPosition(doc)
  }, [doc, zoom])
  useLayoutEffect(() => {
    if (!target || !doc) return
    doc.getElementById(target.id)?.scrollIntoView()
    anchor.current = readingPosition(doc)
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
