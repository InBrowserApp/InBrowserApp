import { useEffect, useLayoutEffect, useState } from "react"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"
import { scrollReadingTarget } from "@workspace/ui/lib/scroll-reading-target"
import { EXPORT_THEME_STYLES } from "../core/export-styles"
import type { PreviewTheme } from "../types"

export function PreviewFrame({
  html,
  title,
  zoom,
  wide,
  theme,
  target,
  onMissing,
}: {
  html: string
  title: string
  zoom: number
  wide: boolean
  theme: PreviewTheme
  target: { id: string } | null
  onMissing: () => void
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const { preserve, navigate } = useReadingPosition(doc)
  useEffect(() => {
    if (!doc) return
    function go(id: string) {
      try {
        id = decodeURIComponent(id)
      } catch {
        /* Literal fragment. */
      }
      const anchor = id ? doc!.getElementById(id) : doc!.body
      if (!anchor) {
        onMissing()
        return
      }
      navigate(() => {
        let parent = anchor.parentElement
        while (parent) {
          if (parent.localName === "details") parent.setAttribute("open", "")
          parent = parent.parentElement
        }
        scrollReadingTarget(doc!, anchor)
        anchor.tabIndex = -1
        anchor.focus({ preventScroll: true })
      })
    }
    function activate(event: MouseEvent | KeyboardEvent) {
      const link = (event.target as Element)?.closest?.("[data-markdown-link]")
      if (!link) return
      event.preventDefault()
      const href = link.getAttribute("data-markdown-link")!
      if (href.startsWith("#")) go(href.slice(1))
      else window.open(href, "_blank", "noopener,noreferrer")
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
  }, [doc, navigate, onMissing])
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      doc.documentElement.style.fontSize = `${(16 * zoom) / 100}px`
      doc.querySelector("main")!.style.maxWidth = wide ? "none" : "76ch"
      let style = doc.head.querySelector("style[data-reader-theme]")
      if (!style) {
        style = doc.createElement("style")
        style.setAttribute("data-reader-theme", "")
        doc.head.append(style)
      }
      style.textContent = EXPORT_THEME_STYLES[theme]
    })
  }, [doc, zoom, wide, theme, preserve])
  useLayoutEffect(() => {
    if (!doc || !target) return
    const anchor = doc.getElementById(target.id)
    if (!anchor) {
      onMissing()
      return
    }
    navigate(() => {
      scrollReadingTarget(doc, anchor)
      anchor.tabIndex = -1
      anchor.focus({ preventScroll: true })
    })
    ;(doc.defaultView?.frameElement as HTMLElement | null)?.focus({
      preventScroll: true,
    })
  }, [doc, target, navigate, onMissing])
  // Parent-owned keyboard/link handlers need allow-scripts in WebKit. The
  // first-head CSP prohibits scripts; sanitized links cannot navigate this frame.
  return (
    <iframe
      title={title}
      sandbox="allow-same-origin allow-scripts"
      srcDoc={html}
      className="h-full min-h-0 w-full border-0"
      onLoad={(event) => {
        const loaded = event.currentTarget.contentDocument
        if (loaded?.querySelector("main")) setDoc(loaded)
      }}
    />
  )
}
