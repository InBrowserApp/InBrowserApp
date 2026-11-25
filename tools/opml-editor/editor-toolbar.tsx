import { useRef } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, Folder, Plus } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { PasteDialog } from "./paste-dialog"
import { example } from "./sample"
import type { Messages } from "./types"

export function EditorToolbar({
  messages: m,
  loaded,
  title,
  exported,
  openFile,
  readText,
  reset,
}: {
  messages: Messages
  loaded: boolean
  title: string
  exported: string
  openFile: (file: File) => Promise<void>
  readText: (text: string) => boolean
  reset: () => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={loaded ? "outline" : "default"}
          size="sm"
          onClick={() => fileInput.current?.click()}
        >
          <Folder data-icon="inline-start" aria-hidden="true" />
          {m.open}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".opml,.xml,text/xml,application/xml,text/x-opml"
          aria-label={m.open}
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ""
            if (file) void openFile(file)
          }}
        />
        <PasteDialog messages={m} read={readText} />
        {loaded ? (
          <Button size="sm" variant="ghost" onClick={reset}>
            <Plus data-icon="inline-start" aria-hidden="true" />
            {m.newOutline}
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => readText(example)}>
            {m.sample}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ToolCopyButton
          value={exported}
          copyLabel={m.copy}
          copiedLabel={m.copied}
          failedLabel={m.copyError}
        />
        <Button
          size="sm"
          disabled={!exported}
          variant={exported ? "default" : "outline"}
          onClick={() => {
            const filename = title.trim().replace(/[<>:"/\\|?*]/g, "_")
            downloadBlob(
              new Blob([exported], { type: "text/x-opml;charset=utf-8" }),
              `${filename || "subscriptions"}.opml`
            )
          }}
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {m.download}
        </Button>
      </div>
    </div>
  )
}
