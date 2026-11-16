import { useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import type { Messages } from "../types"

export function FilePicker({
  file,
  onFile,
  messages: m,
  id,
  lang,
}: {
  file: File | null
  onFile: (file: File) => void
  messages: Messages
  id: string
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const next = event.dataTransfer.files[0]
        if (next) onFile(next)
      }}
      className="flex min-w-0 flex-col items-start gap-3 rounded-lg border border-dashed p-4"
    >
      <p id={`${id}-drop-help`} className="text-sm text-muted-foreground">
        {m.dropHelp}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={() => picker.current?.click()}
      >
        {m.chooseFile}
      </Button>
      <input
        ref={picker}
        type="file"
        className="sr-only"
        aria-label={m.chooseFile}
        aria-describedby={`${id}-drop-help`}
        tabIndex={-1}
        onChange={(event) => {
          const next = event.target.files?.[0]
          if (next) onFile(next)
          event.target.value = ""
        }}
      />
      {file ? (
        <p className="max-w-full text-sm break-all" dir="auto">
          {file.name} · {new Intl.NumberFormat(lang).format(file.size)}{" "}
          {m.bytesLabel}
        </p>
      ) : null}
    </div>
  )
}
