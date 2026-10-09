import { useEffect, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, Printer } from "@workspace/ui/icons"
import type { MarkdownPreviewerMessages } from "../types"

export function PreviewActions({
  html,
  filename,
  disabled,
  messages: m,
}: {
  html: string
  filename: string
  disabled: boolean
  messages: MarkdownPreviewerMessages
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    if (disabled) {
      setUrl("")
      return
    }
    const next = URL.createObjectURL(
      new Blob([html], { type: "text/html;charset=utf-8" })
    )
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [html, disabled])
  function print() {
    const popup = window.open("", "_blank")
    if (!popup) return
    popup.opener = null
    popup.document.open()
    popup.document.write(html)
    popup.onafterprint = () => popup.close()
    // WebKit can finish loading synchronously inside document.close().
    popup.addEventListener(
      "load",
      () => {
        popup.focus()
        popup.print()
      },
      { once: true }
    )
    popup.document.close()
  }
  return (
    <div className="flex flex-wrap gap-1">
      <ToolCopyButton
        value={html}
        copyLabel={m.copyHtmlLabel}
        copiedLabel={m.copiedLabel}
        disabled={disabled}
      />
      {url && !disabled ? (
        <Button asChild variant="ghost" size="sm">
          <a href={url} download={filename}>
            <Download data-icon="inline-start" />
            {m.downloadHtmlLabel}
          </a>
        </Button>
      ) : (
        <Button variant="ghost" size="sm" disabled>
          <Download data-icon="inline-start" />
          {m.downloadHtmlLabel}
        </Button>
      )}
      <Button variant="ghost" size="sm" disabled={disabled} onClick={print}>
        <Printer data-icon="inline-start" />
        {m.printLabel}
      </Button>
    </div>
  )
}
