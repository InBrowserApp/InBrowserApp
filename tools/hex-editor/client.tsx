import { useRef, useState } from "react"
import type { DragEvent } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Binary, File as FileIcon, Folder } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Workspace } from "./workspace"
import type { Messages } from "./types"

type OpenedFile = { file: File; id: number }

export default function HexEditor({
  messages,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedFile>()
  const [dragging, setDragging] = useState(false)

  function open(file: File) {
    setOpened((current) => ({ file, id: (current?.id ?? 0) + 1 }))
  }

  function openSample() {
    const sample = new File(
      [
        "InBrowser.App\n\nHello, hex!\n",
        new Uint8Array([0x00, 0x01, 0x02, 0x7f, 0x80, 0xff]),
        "\n\nEvery file is a sequence of bytes.\n",
      ],
      "hex-sample.bin",
      { type: "application/octet-stream" }
    )
    open(sample)
  }

  function dragOver(event: DragEvent) {
    if (!event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setDragging(true)
  }

  function drop(event: DragEvent) {
    if (!event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) open(file)
  }

  return (
    <Card
      className={cn("min-w-0", dragging && "ring-primary")}
      onDragOver={dragOver}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDragging(false)
        }
      }}
      onDrop={drop}
    >
      <CardContent className="grid min-w-0 gap-4">
        <input
          ref={input}
          type="file"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ""
            if (file) open(file)
          }}
        />

        <div
          className={cn(
            "min-w-0 rounded-lg",
            opened
              ? "flex flex-wrap items-center justify-between gap-3"
              : "flex min-h-48 flex-col items-center justify-center gap-4 border border-dashed bg-muted/35 px-4 py-6 text-center",
            dragging && "bg-primary/5"
          )}
        >
          {opened ? (
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <FileIcon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-medium"
                  title={opened.file.name}
                >
                  <bdi>{opened.file.name}</bdi>
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat(lang, {
                    style: "unit",
                    unit: "byte",
                    unitDisplay: "long",
                  }).format(opened.file.size)}
                </p>
              </div>
            </div>
          ) : (
            <>
              <span className="grid size-10 place-items-center rounded-lg border bg-background text-muted-foreground">
                <Binary aria-hidden="true" className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">
                {messages.dropFile}
              </p>
            </>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant={opened ? "outline" : "default"}
              onClick={() => input.current?.click()}
            >
              <Folder aria-hidden="true" data-icon="inline-start" />
              {opened ? messages.replaceFile : messages.openFile}
            </Button>
            {!opened && (
              <Button type="button" variant="outline" onClick={openSample}>
                {messages.trySample}
              </Button>
            )}
          </div>
        </div>

        {opened && (
          <Workspace
            key={opened.id}
            file={opened.file}
            messages={messages}
            lang={lang}
          />
        )}
      </CardContent>
    </Card>
  )
}
