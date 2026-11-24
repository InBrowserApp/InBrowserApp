import { useState, type Ref } from "react"

import { Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

type Props = {
  buttonRef: Ref<HTMLButtonElement>
  choosePdf: string
  dropPdf: string
  onChoose: () => void
  onSelect: (files: FileList) => void
}

export function PdfDropzone({
  buttonRef,
  choosePdf,
  dropPdf,
  onChoose,
  onSelect,
}: Props) {
  const [dragging, setDragging] = useState(false)

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        "group flex min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        dragging && "border-primary bg-primary/5"
      )}
      onClick={onChoose}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        onSelect(event.dataTransfer.files)
      }}
    >
      <span className="mb-2 rounded-xl border bg-background p-3 text-primary shadow-xs">
        <Upload className="size-6" aria-hidden="true" />
      </span>
      <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground group-hover:bg-primary/90">
        {choosePdf}
      </span>
      <span className="text-sm text-muted-foreground">{dropPdf}</span>
    </button>
  )
}
