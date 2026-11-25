import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Code, FolderInput } from "@workspace/ui/icons"
import { examples } from "./examples"

export { examples }

type Example = keyof typeof examples

export interface FileMessages {
  openFile: string
  fileError: string
  sourcePlaceholder: string
}

interface Props {
  messages: { source: string; example: string } & Record<Example, string>
  fileLabels?: FileMessages
  source: string
  onChange: (value: string, filename?: string) => void
}

const exampleNames = Object.keys(examples) as Example[]

export function SourcePanel({
  messages: m,
  fileLabels,
  source,
  onChange,
}: Props) {
  const sourceId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const fileRead = useRef(0)
  const [fileError, setFileError] = useState(false)

  function updateSource(value: string, filename?: string) {
    fileRead.current++
    setFileError(false)
    onChange(value, filename)
  }

  async function openFile(file: File) {
    const request = ++fileRead.current
    setFileError(false)
    try {
      const text = await file.text()
      if (request !== fileRead.current) return
      onChange(text, file.name.replace(/\.[^.]+$/, "") || "mermaid-diagram")
    } catch {
      if (request === fileRead.current) setFileError(true)
    }
  }

  return (
    <section
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
      onDragOver={
        fileLabels
          ? (event) => {
              if (event.dataTransfer.types.includes("Files"))
                event.preventDefault()
            }
          : undefined
      }
      onDrop={
        fileLabels
          ? (event) => {
              const file = event.dataTransfer.files[0]
              if (!file) return
              event.preventDefault()
              void openFile(file)
            }
          : undefined
      }
    >
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <label
          htmlFor={sourceId}
          className="flex items-center gap-2 font-medium"
        >
          <Code aria-hidden="true" className="size-4 text-muted-foreground" />
          {m.source}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {fileLabels && (
            <>
              <input
                type="file"
                ref={fileInput}
                accept=".mmd,.mermaid,.md,.txt,text/plain,text/markdown"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  event.currentTarget.value = ""
                  if (file) void openFile(file)
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                <FolderInput data-icon="inline-start" aria-hidden="true" />
                {fileLabels.openFile}
              </Button>
            </>
          )}
          <Select
            value=""
            onValueChange={(value) => {
              updateSource(examples[value as Example], "mermaid-diagram")
            }}
          >
            <SelectTrigger aria-label={m.example}>
              <SelectValue placeholder={m.example} />
            </SelectTrigger>
            <SelectContent position="popper">
              {exampleNames.map((key) => (
                <SelectItem key={key} value={key}>
                  {m[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea
        id={sourceId}
        dir="ltr"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        wrap="off"
        value={source}
        placeholder={fileLabels?.sourcePlaceholder}
        onChange={(event) => updateSource(event.target.value)}
        className="h-56 flex-auto resize-none rounded-none border-0 p-4 font-mono focus-visible:ring-inset sm:h-72 lg:h-96"
      />
      {fileLabels && fileError && (
        <p
          role="status"
          className="border-t px-4 py-2 text-sm text-destructive"
        >
          {fileLabels.fileError}
        </p>
      )}
    </section>
  )
}
