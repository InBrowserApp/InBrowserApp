import { useEffect, useRef, useState } from "react"
import { scrollReadingTarget } from "@workspace/ui/lib/scroll-reading-target"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { Book } from "./book"
import type { Messages } from "./messages"
import type { RenderedTopic } from "./render-topic"
import type { Destination } from "./topics"

function scrollToFragment(document: Document, fragment?: string) {
  if (!fragment) {
    document.defaultView?.scrollTo(0, 0)
    return
  }
  const target =
    document.getElementById(fragment) ?? document.getElementsByName(fragment)[0]
  scrollReadingTarget(document, target)
}

export function TopicFrame({
  book,
  topic,
  messages: m,
  onNavigate,
}: {
  book: Book
  topic: Destination
  messages: Messages
  onNavigate: (destination: Destination) => void
}) {
  const { path, fragment } = topic
  const [page, setPage] = useState<RenderedTopic | "error" | null>(null)
  const [document, setDocument] = useState<Document | null>(null)
  const navigate = useRef(onNavigate)
  navigate.current = onNavigate
  useEffect(() => {
    const controller = new AbortController()
    let rendered: RenderedTopic | null = null
    void book.readTopic(path, controller.signal).then(
      (result) => {
        rendered = result
        if (controller.signal.aborted) result.dispose()
        else setPage(result)
      },
      () => {
        if (!controller.signal.aborted) setPage("error")
      }
    )
    return () => {
      controller.abort()
      rendered?.dispose()
    }
  }, [book, path])

  useEffect(() => {
    if (!document) return
    function activate(event: MouseEvent | KeyboardEvent) {
      const link = (event.target as Element)?.closest?.<HTMLElement>(
        "a[data-chm-link-kind], area[data-chm-link-kind]"
      )
      if (!link) return
      event.preventDefault()
      const { chmLinkKind, chmPath, chmFragment } = link.dataset
      if (chmLinkKind === "fragment") {
        navigate.current({ path, fragment: chmFragment })
      } else if (chmLinkKind === "internal" && chmPath) {
        navigate.current({
          path: book.lookupTopic(chmPath) ?? chmPath,
          fragment: chmFragment,
        })
      }
    }
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented) return
      if (event.key === "Enter") activate(event)
      if (event.key !== "Escape") return
      const dialog = document!.defaultView?.frameElement?.closest("dialog")
      if (dialog?.matches(":modal")) {
        event.preventDefault()
        dialog.requestClose()
      }
    }
    document.addEventListener("click", activate)
    document.addEventListener("keydown", keydown)
    return () => {
      document.removeEventListener("click", activate)
      document.removeEventListener("keydown", keydown)
    }
  }, [book, document, path])

  useEffect(() => {
    if (document) scrollToFragment(document, fragment)
  }, [document, fragment])

  if (page === "error") {
    return (
      <p role="alert" className="p-6 text-sm text-destructive">
        {m.topicError}
      </p>
    )
  }
  if (!page) {
    return (
      <p role="status" className="flex items-center gap-2 p-6 text-sm">
        <Spinner />
        {m.topicLoading}
      </p>
    )
  }
  // WebKit needs allow-scripts for the parent’s event listeners. The topic
  // CSP blocks scripts and the sanitizer removes document navigation.
  return (
    <iframe
      className="block h-full w-full border-0 bg-background"
      title={page.title || m.topicContent}
      srcDoc={page.html}
      sandbox="allow-same-origin allow-scripts"
      referrerPolicy="no-referrer"
      onLoad={(event) => setDocument(event.currentTarget.contentDocument)}
    />
  )
}
