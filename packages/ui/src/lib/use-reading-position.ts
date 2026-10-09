import { useLayoutEffect, useMemo } from "react"
import { readingPosition } from "./reading-position"

/** Preserve a visible character while the same reading document reflows. */
export function useReadingPosition(doc: Document | null) {
  const tracking = useMemo(() => {
    let position: ReturnType<typeof readingPosition> = null
    let width = 0
    let height = 0
    const view = doc?.defaultView
    const visible = () =>
      !!doc &&
      !!view &&
      view.document === doc &&
      (!view.frameElement || view.frameElement.clientWidth > 0) &&
      view.innerWidth > 0 &&
      view.innerHeight > 0
    const remember = () => {
      if (!visible()) return
      position = readingPosition(doc!)
      width = view!.innerWidth
      height = view!.innerHeight
    }
    const restore = () => {
      if (!visible()) return
      if (position) {
        const bounds = position.target.getBoundingClientRect()
        view!.scrollBy(bounds.left - position.left, bounds.top - position.top)
      }
      remember()
    }
    const update = () => {
      if (!visible()) return
      // A browser may dispatch the reflow's scroll before its resize event.
      if (view!.innerWidth !== width || view!.innerHeight !== height) restore()
      else remember()
    }
    return {
      remember,
      restore,
      scroll: update,
      navigate: (change: () => void) => {
        // Firefox needs both layouts flushed after revealing a hidden frame,
        // otherwise navigation can run against its previous zero viewport.
        view?.frameElement?.getBoundingClientRect()
        doc?.documentElement.getBoundingClientRect()
        change()
        remember()
      },
      preserve: (change: () => void) => {
        update()
        change()
        restore()
      },
    }
  }, [doc])
  useLayoutEffect(() => {
    const view = doc?.defaultView
    if (!doc || !view) return
    tracking.remember()
    const observer = new ResizeObserver(tracking.restore)
    observer.observe(doc.body)
    if (view.frameElement) observer.observe(view.frameElement)
    view.addEventListener("resize", tracking.restore)
    view.addEventListener("scroll", tracking.scroll, { passive: true })
    return () => {
      observer.disconnect()
      view.removeEventListener("resize", tracking.restore)
      view.removeEventListener("scroll", tracking.scroll)
    }
  }, [doc, tracking])
  return { preserve: tracking.preserve, navigate: tracking.navigate }
}
