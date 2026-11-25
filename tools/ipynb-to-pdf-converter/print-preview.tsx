import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Printer } from "@workspace/ui/icons"
import type { Messages } from "./types"

export function PrintPreview({
  html,
  messages: m,
}: {
  html: string
  messages: Messages
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const paperSize = useRef<HTMLSelectElement>(null)
  const sizeId = useId()
  const helpId = useId()
  const [url, setUrl] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const next = URL.createObjectURL(
      new Blob([html], { type: "text/html;charset=utf-8" })
    )
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [html])

  function savePdf() {
    const preview = frame.current!
    const doc = preview.contentDocument!
    const size = paperSize.current!.value === "letter" ? "letter" : "A4"
    let paper = doc.getElementById("notebook-paper")
    if (!paper) {
      paper = doc.createElement("style")
      paper.id = "notebook-paper"
      doc.head.append(paper)
    }
    paper.textContent = `@page { size: ${size}; margin: 14mm; }`
    preview.contentWindow!.print()
  }

  return (
    <>
      <div className="space-y-2 border-b px-3 py-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor={sizeId}>{m.paper}</Label>
            <select
              ref={paperSize}
              id={sizeId}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="A4">A4</option>
              <option value="letter">US Letter</option>
            </select>
          </div>
          <Button
            onClick={savePdf}
            disabled={!loaded}
            aria-describedby={helpId}
          >
            <Printer data-icon="inline-start" aria-hidden="true" />
            {m.save}
          </Button>
        </div>
        <p id={helpId} className="text-sm text-muted-foreground">
          {m.saveHelp}
        </p>
      </div>
      {url ? (
        <iframe
          ref={frame}
          src={url}
          title={m.preview}
          sandbox="allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setLoaded(true)}
          className="block min-h-72 w-full flex-1 bg-white"
        />
      ) : null}
    </>
  )
}
