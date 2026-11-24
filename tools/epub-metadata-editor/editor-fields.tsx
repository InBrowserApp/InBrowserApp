import { useEffect, useId, useState, type ChangeEvent } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ImageIcon, ImageUp, Undo2 } from "@workspace/ui/icons"
import type { BookDetails, Messages } from "./types"

const detailFields = [
  ["title", "input", true],
  ["authors", "list"],
  ["language", "input", true],
  ["publisher", "input"],
  ["subjects", "list"],
  ["description", "textarea"],
] as const

export function CoverField({
  cover,
  replacement,
  loading,
  error,
  messages: m,
  onPick,
  onRestore,
}: {
  cover: Blob | null
  replacement: Blob | null
  loading: boolean
  error: boolean
  messages: Messages
  onPick: () => void
  onRestore: () => void
}) {
  const formatsId = useId()
  const blob = replacement ?? cover
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(
    null
  )
  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    setPreview({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])
  const url = preview?.blob === blob ? preview.url : null

  return (
    <section className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] grid-rows-[min-content_1fr] items-start gap-x-4 gap-y-2 md:grid-cols-1 md:grid-rows-none md:gap-y-3">
      <h2 className="col-start-2 row-start-1 text-sm font-semibold md:col-start-1">
        {m.cover}
      </h2>
      <div className="col-start-1 row-span-2 row-start-1 flex aspect-[2/3] items-center justify-center overflow-hidden rounded-lg border bg-muted/50 md:row-span-1 md:row-start-2">
        {url ? (
          <img
            src={url}
            alt={m.cover}
            className="size-full object-contain"
            onError={() =>
              setPreview((current) => (current?.url === url ? null : current))
            }
          />
        ) : (
          <div className="grid min-w-0 justify-items-center gap-2 px-2 text-center text-xs wrap-anywhere text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden="true" />
            <span>{m.noCover}</span>
          </div>
        )}
      </div>
      <div className="col-start-2 row-start-2 grid min-w-0 justify-items-start gap-2 md:col-start-1 md:row-start-3">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-9 max-w-full text-start whitespace-normal"
          aria-busy={loading}
          aria-describedby={formatsId}
          onClick={onPick}
        >
          {loading ? (
            <Spinner aria-hidden="true" />
          ) : (
            <ImageUp data-icon="inline-start" aria-hidden="true" />
          )}
          {blob ? m.replaceCover : m.chooseCover}
        </Button>
        <span id={formatsId} className="text-xs text-muted-foreground">
          {m.coverFormats}
        </span>
        {replacement && (
          <Button
            type="button"
            variant="ghost"
            className="h-auto min-h-8 max-w-full text-start whitespace-normal"
            onClick={onRestore}
          >
            <Undo2 data-icon="inline-start" aria-hidden="true" />
            {m.restoreCover}
          </Button>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {m.invalidCover}
          </p>
        )}
      </div>
    </section>
  )
}

export function DetailsFields({
  details,
  messages: m,
  onChange,
}: {
  details: BookDetails
  messages: Messages
  onChange: (field: keyof BookDetails, value: string) => void
}) {
  const id = useId()

  return (
    <section className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-x-4">
      <h2 className="text-sm font-semibold sm:col-span-2">{m.details}</h2>
      {detailFields.map(([field, kind, required]) => {
        const controlId = id + "-" + field
        const hint = kind === "list" ? controlId + "-hint" : undefined
        const language = field === "language"
        const halfWidth = language || field === "publisher"
        const control = {
          id: controlId,
          name: field,
          value: details[field],
          onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => onChange(field, event.target.value),
        }
        return (
          <div
            key={field}
            className={
              halfWidth ? "grid gap-1.5" : "grid gap-1.5 sm:col-span-2"
            }
          >
            <Label htmlFor={controlId}>{m[field]}</Label>
            {kind === "input" ? (
              <Input
                {...control}
                className="h-9"
                dir={language ? "ltr" : "auto"}
                placeholder={language ? "en" : undefined}
                spellCheck={language ? false : undefined}
                required={required}
                pattern={required ? ".*\\S.*" : undefined}
              />
            ) : (
              <Textarea
                {...control}
                dir="auto"
                aria-describedby={hint}
                rows={kind === "list" ? 1 : 3}
                className={
                  kind === "list"
                    ? "max-h-32 min-h-9 py-1.5"
                    : "max-h-48 min-h-20"
                }
              />
            )}
            {hint && (
              <span id={hint} className="text-xs text-muted-foreground">
                {m.onePerLine}
              </span>
            )}
          </div>
        )
      })}
    </section>
  )
}
