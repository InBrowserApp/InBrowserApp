import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { File, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

type Labels = {
  chooseFile: string
  changeFile: string
  dropHint: string
  privacy: string
}

export function FileDropPicker({
  name,
  accept,
  formats,
  icon: Icon = File,
  labels,
  example,
  onFile,
}: {
  name: string
  accept: string
  formats: string
  icon?: typeof File
  labels: Labels
  example?: { label: string; onClick: () => void }
  onFile: (file: File) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-3">
        <div
          className={cn(
            "rounded-lg border border-dashed bg-muted/25 transition-colors",
            dragging && "border-primary bg-primary/5"
          )}
          onDragOver={(event) => {
            if (!event.dataTransfer.types.includes("Files")) return
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setDragging(true)
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file) onFile(file)
          }}
        >
          <input
            ref={input}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              if (file) onFile(file)
              event.currentTarget.value = ""
            }}
          />
          <div className={cn(name && "flex flex-wrap items-center gap-3 p-3")}>
            {name && (
              <>
                <Icon
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="min-w-0 flex-1 basis-24 font-medium wrap-anywhere">
                  <bdi>{name}</bdi>
                </p>
              </>
            )}
            <Button
              type="button"
              variant={name ? "outline" : "ghost"}
              aria-label={name ? undefined : labels.chooseFile}
              className={
                name
                  ? "min-h-11 sm:min-h-0"
                  : "h-auto min-h-40 w-full flex-col gap-2 px-4 py-6 whitespace-normal"
              }
              onClick={() => input.current?.click()}
            >
              {name ? (
                labels.changeFile
              ) : (
                <>
                  <Upload
                    className="mb-1 size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{labels.chooseFile}</span>
                  <span className="font-normal text-muted-foreground">
                    {labels.dropHint}
                  </span>
                  <bdi className="mt-1 text-xs font-normal text-muted-foreground">
                    {formats}
                  </bdi>
                </>
              )}
            </Button>
          </div>
        </div>
        {!name && example && (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 self-center sm:min-h-8"
            onClick={example.onClick}
          >
            {example.label}
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          {labels.privacy}
        </p>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
