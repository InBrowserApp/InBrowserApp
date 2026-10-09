import { useEffect, useLayoutEffect, useState } from "react"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"

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
  const { preserve, navigate } = useReadingPosition(doc)
  useEffect(() => {
    if (!doc) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const link = (event.target as Element)?.closest?.("[data-web-link]")
      if (!link) return
      event.preventDefault()
      const href = link.getAttribute("data-web-link")!
      if (!href.startsWith("#")) {
        if (/^(?:https?:\/\/|mailto:)/i.test(href))
          window.open(href, "_blank", "noopener,noreferrer")
        return
      }
      let id = href.slice(1)
      try {
        id = decodeURIComponent(id)
      } catch {
        /* Use the literal bookmark. */
      }
      const anchor = id ? doc!.getElementById(id) : doc!.body
      if (anchor) {
        for (
          let details = anchor.closest("details");
          details;
          details = details.parentElement?.closest("details") ?? null
        )
          details.open = true
        navigate(() =>
          doc!.defaultView?.scrollBy(0, anchor.getBoundingClientRect().top)
        )
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
    const observer = new ResizeObserver(update)
    observer.observe(doc.body)
    view.addEventListener("scroll", update, { passive: true })
    view.addEventListener("resize", update)
    update()
    return () => {
      observer.disconnect()
      view.removeEventListener("scroll", update)
      view.removeEventListener("resize", update)
    }
  }, [doc, onPosition])
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      doc.documentElement.style.zoom = String(zoom / 100)
    })
  }, [doc, zoom, preserve])
  useLayoutEffect(() => {
    if (!target || !doc) return
    navigate(() => {
      const anchor = doc.getElementById(target.id)
      if (anchor)
        doc.defaultView?.scrollBy(0, anchor.getBoundingClientRect().top)
    })
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
