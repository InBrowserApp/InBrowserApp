import { useId, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { FileJson2, FolderInput, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { IdFormat } from "./core/pattern"
import type EnglishMessages from "./messages/en.json"

type Labels = typeof EnglishMessages

export interface PatternInput {
  uri: string
  first: string
  last: string
  format: IdFormat
}

export function LocalFileInput({
  count,
  language,
  messages,
  onSelect,
}: {
  count: number
  language: string
  messages: Labels
  onSelect: (files: File[], folder: boolean) => void
}) {
  const files = useRef<HTMLInputElement>(null)
  const folder = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div
      className={cn(
        "grid min-h-36 place-content-center justify-items-center gap-2 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
        dragging && "border-primary bg-primary/5"
      )}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        onSelect(Array.from(event.dataTransfer.files), false)
      }}
    >
      <Upload aria-hidden="true" className="size-6 text-muted-foreground" />
      <p className="text-sm" role="status">
        {count > 0
          ? `${messages.selected} · ${count.toLocaleString(language)}`
          : messages.drop}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() => files.current?.click()}
        >
          <FileJson2 data-icon="inline-start" aria-hidden="true" />
          {messages.chooseFiles}
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() => folder.current?.click()}
        >
          <FolderInput data-icon="inline-start" aria-hidden="true" />
          {messages.chooseFolder}
        </Button>
      </div>
      {([files, folder] as const).map((picker, index) => (
        <input
          key={index}
          ref={picker}
          type="file"
          hidden
          multiple
          {...(index === 1 && { webkitdirectory: "" })}
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? [])
            event.target.value = ""
            if (selected.length > 0) onSelect(selected, index === 1)
          }}
        />
      ))}
    </div>
  )
}

export function UriPatternInput({
  value,
  messages,
  onChange,
}: {
  value: PatternInput
  messages: Labels
  onChange: (value: PatternInput) => void
}) {
  const id = useId()

  return (
    <div className="grid gap-3">
      <Field>
        <FieldLabel htmlFor={`${id}-uri`}>{messages.patternLabel}</FieldLabel>
        <Input
          id={`${id}-uri`}
          dir="ltr"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="font-mono"
          value={value.uri}
          placeholder="https://example.com/metadata/{id}.json"
          onChange={(event) => onChange({ ...value, uri: event.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(["first", "last"] as const).map((bound) => (
          <Field key={bound}>
            <FieldLabel htmlFor={`${id}-${bound}`}>
              {messages[`${bound}Id`]}
            </FieldLabel>
            <Input
              id={`${id}-${bound}`}
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              value={value[bound]}
              onChange={(event) =>
                onChange({ ...value, [bound]: event.target.value })
              }
            />
          </Field>
        ))}
        <Field className="col-span-2 sm:col-span-1">
          <FieldLabel htmlFor={`${id}-format`}>{messages.idFormat}</FieldLabel>
          <select
            id={`${id}-format`}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            value={value.format}
            onChange={(event) =>
              onChange({ ...value, format: event.target.value as IdFormat })
            }
          >
            <option value="decimal">{messages.decimal}</option>
            <option value="hex">{messages.hex}</option>
          </select>
        </Field>
      </div>
    </div>
  )
}

export function exampleFiles() {
  return [
    new File(
      [
        JSON.stringify({
          name: "Paper Moon",
          image: "data:image/svg+xml,%3Csvg%2F%3E",
          attributes: [{ trait_type: "Phase", value: "Crescent" }],
        }),
      ],
      "1.json"
    ),
    new File(
      [
        JSON.stringify({
          name: "Blue Moon",
          attributes: [{ trait_type: "Phase", value: null }],
        }),
      ],
      "2.json"
    ),
    new File(['{"name":"Moon 3",}'], "3.json"),
  ]
}
