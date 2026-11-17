import { useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ArrowLeftRight,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
  X,
} from "@workspace/ui/icons"
import type { Messages } from "../types"

export function SubtitleInput({
  input,
  files,
  busy,
  onInput,
  onFiles,
  onExample,
  onClear,
  onConvert,
  messages: m,
}: {
  input: string
  files: File[]
  busy: boolean
  onInput: (text: string) => void
  onFiles: (files: File[]) => void
  onExample: () => void
  onClear: () => void
  onConvert: () => void
  messages: Messages
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  return (
    <Card
      className="min-w-0 xl:row-span-3 xl:grid xl:grid-rows-subgrid"
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
      }}
      onDrop={(e) => {
        e.preventDefault()
        if (!busy && e.dataTransfer.files.length)
          onFiles(Array.from(e.dataTransfer.files))
      }}
    >
      <CardHeader>
        <CardTitle>
          <h2>{m.input}</h2>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{m.inputHint}</p>
      </CardHeader>
      <CardContent className="grid flex-1 content-start gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => fileInput.current!.click()}
          >
            <Upload data-icon="inline-start" aria-hidden="true" />
            {m.open}
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={onExample}>
            <FileText data-icon="inline-start" aria-hidden="true" />
            {m.example}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={busy || (!input && !files.length)}
            onClick={onClear}
          >
            <Trash2 data-icon="inline-start" aria-hidden="true" />
            {m.clear}
          </Button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            aria-label={m.open}
            accept=".srt,.vtt,.ass,.ssa,.sbv,.sub,.smi,.sami,.lrc,.ttml,.dfxp,.itt,.xml,.srv3,.mpl,.mpl2,.stl,.txt,.json,.csv,.tsv"
            onChange={(e) => {
              if (e.target.files?.length) onFiles(Array.from(e.target.files))
              e.target.value = ""
            }}
          />
        </div>
        {files.length ? (
          <ul
            aria-label={m.files}
            className="max-h-80 space-y-2 overflow-y-auto xl:h-80"
          >
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <span className="min-w-0 truncate" title={file.name}>
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${m.remove}: ${file.name}`}
                  disabled={busy}
                  onClick={() => onFiles(files.filter((_f, i) => i !== index))}
                >
                  <X aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Textarea
            aria-label={m.input}
            placeholder={m.paste}
            rows={11}
            spellCheck={false}
            dir="auto"
            className="h-64 min-h-64 resize-y overflow-y-auto font-mono text-base md:text-sm xl:h-80"
            value={input}
            disabled={busy}
            onChange={(e) => onInput(e.target.value)}
          />
        )}
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Button
          disabled={busy || (!input.trim() && !files.length)}
          onClick={onConvert}
        >
          {busy ? (
            <LoaderCircle
              data-icon="inline-start"
              aria-hidden="true"
              className="animate-spin"
            />
          ) : (
            <ArrowLeftRight data-icon="inline-start" aria-hidden="true" />
          )}
          {busy ? m.converting : m.convert}
        </Button>
      </CardFooter>
    </Card>
  )
}
