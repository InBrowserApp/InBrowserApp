import { useRef, useState } from "react"
import { Folder } from "../../../icons"
import { cn } from "../../../lib/utils"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"
import { Spinner } from "../../ui/spinner"
import type { ReactNode } from "react"

export function MeshFileInput({
  accept,
  onFile,
  onExample,
  open,
  example,
  drop,
  privacy,
  icon,
  filled,
  working,
  error,
  children,
}: {
  accept: string
  onFile: (file: File) => void
  onExample: () => void
  open: string
  example: string
  drop: string
  privacy: string
  icon: ReactNode
  filled: boolean
  working?: string
  error?: string
  children: ReactNode
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <section
      className={cn(
        "grid min-w-0 gap-3 rounded-lg",
        dragging && "ring-2 ring-ring"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) onFile(file)
      }}
    >
      <input
        ref={picker}
        hidden
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) onFile(file)
        }}
      />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Empty
        className={
          filled
            ? "items-start gap-2 p-0"
            : "min-h-64 border border-dashed bg-muted/30"
        }
      >
        {!filled && (
          <EmptyHeader>
            <EmptyMedia variant="icon">{icon}</EmptyMedia>
            <EmptyTitle>{drop}</EmptyTitle>
            <EmptyDescription>{privacy}</EmptyDescription>
          </EmptyHeader>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filled ? "outline" : "default"}
            onClick={() => picker.current?.click()}
          >
            <Folder data-icon="inline-start" aria-hidden="true" />
            {open}
          </Button>
          <Button variant="outline" onClick={onExample}>
            {example}
          </Button>
        </div>
        {working && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
            {working}
          </p>
        )}
      </Empty>
      {children}
    </section>
  )
}
