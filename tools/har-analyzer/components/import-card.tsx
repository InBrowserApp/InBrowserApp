import { useId, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileJson2, Upload, Trash2, Play } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "../types"

type Props = {
  messages: Messages
  name: string | null
  loading: boolean
  onOpen: (file: File) => void
  onExample: () => void
  onClear: () => void
}

export function ImportCard({
  messages: m,
  name,
  loading,
  onOpen,
  onExample,
  onClear,
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const [dragging, setDragging] = useState(false)
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{m.importTitle}</CardTitle>
        <CardDescription>{m.importDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <input
          id={id}
          ref={input}
          type="file"
          accept=".har,.json,application/json"
          aria-label={m.chooseFile}
          className="sr-only"
          disabled={loading}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onOpen(file)
            event.target.value = ""
          }}
        />
        {name ? (
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Badge variant="secondary" className="max-w-full">
              <span className="truncate" dir="auto">
                {name}
              </span>
            </Badge>
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              <Trash2 aria-hidden="true" data-icon="inline-start" />
              {m.clear}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => input.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) onOpen(file)
            }}
            className={cn(
              "w-full rounded-lg border border-dashed border-input focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              dragging && "border-primary bg-accent"
            )}
          >
            <Empty className="min-h-44">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileJson2 aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{m.dropHint}</EmptyTitle>
                <EmptyDescription>{m.limits}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </button>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => input.current?.click()}
            disabled={loading}
          >
            {loading ? (
              <Spinner aria-hidden="true" />
            ) : (
              <Upload aria-hidden="true" data-icon="inline-start" />
            )}
            {loading ? m.loading : m.chooseFile}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onExample}
            disabled={loading}
          >
            <Play aria-hidden="true" data-icon="inline-start" />
            {m.loadExample}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{m.privacy}</p>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
