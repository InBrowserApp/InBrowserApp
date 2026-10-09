import { useEffect, useLayoutEffect, useState } from "react"
import { useReadingPosition } from "@workspace/ui/lib/use-reading-position"
import { scrollReadingTarget } from "@workspace/ui/lib/scroll-reading-target"
export function ReaderFrame({
  html,
  title,
  zoom,
  wrap,
  target,
  end,
  revision,
  focus = true,
}: {
  html: string
  title: string
  zoom: number
  wrap: boolean
  target?: number
  end?: boolean
  revision: number
  focus?: boolean
}) {
  const [doc, setDoc] = useState<Document | null>(null)
  const { preserve, navigate } = useReadingPosition(doc)
  useLayoutEffect(() => {
    if (!doc) return
    preserve(() => {
      doc.documentElement.style.fontSize = `${(14 * zoom) / 100}px`
      doc.documentElement.toggleAttribute("data-wrap", wrap)
    })
  }, [doc, zoom, wrap, preserve])
  useLayoutEffect(() => {
    if (!doc || target === undefined) return
    const element =
      doc.querySelector("mark") ?? doc.getElementById(`line-${target}`)
    if (element)
      navigate(() => {
        if (end)
          doc.defaultView?.scrollTo(
            doc.documentElement.scrollWidth,
            doc.documentElement.scrollHeight
          )
        else {
          scrollReadingTarget(doc, element)
          const bounds = element.getBoundingClientRect()
          if (
            element.localName === "mark" &&
            (bounds.left < 0 || bounds.right > doc.defaultView!.innerWidth)
          )
            doc.defaultView!.scrollBy(bounds.left - 16, 0)
        }
        if (focus) {
          ;(element as HTMLElement).tabIndex = -1
          ;(element as HTMLElement).focus({ preventScroll: true })
        }
      })
  }, [doc, target, end, revision, focus, navigate])
  useEffect(() => {
    if (!doc) return
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return
      const dialog = doc.defaultView?.frameElement?.closest("dialog")
      if (dialog?.matches(":modal")) {
        event.preventDefault()
        dialog.requestClose()
      }
    }
    doc.addEventListener("keydown", key)
    return () => doc.removeEventListener("keydown", key)
  }, [doc])
  // Trusted parent keyboard handlers need allow-scripts in WebKit. The first
  // head CSP blocks scripts, and every source character is HTML-escaped.
  return (
    <iframe
      title={title}
      sandbox="allow-same-origin allow-scripts"
      srcDoc={html}
      className="h-full min-h-0 w-full flex-1 border-0 bg-white"
      onLoad={(event) => setDoc(event.currentTarget.contentDocument)}
    />
  )
}
