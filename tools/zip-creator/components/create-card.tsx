import { useId } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Download, FileArchive } from "@workspace/ui/icons"

import { formatBytes } from "../format"

import type { Messages } from "../types"
import type { Creator } from "../use-zip-creator"

export function CreateCard({
  creator: c,
  messages: m,
  lang,
}: {
  creator: Creator
  messages: Messages
  lang: string
}) {
  const id = useId()
  const disabled = c.status !== null
  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settingsTitle}</CardTitle>
        <CardDescription>{m.memoryNote}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void c.create()
          }}
          className="flex flex-col gap-5"
        >
          <FieldGroup className="sm:flex-row sm:items-start">
            <Field data-invalid={!c.validName} data-disabled={disabled}>
              <FieldLabel htmlFor={`${id}-name`}>{m.filename}</FieldLabel>
              <Input
                id={`${id}-name`}
                name="zip-filename"
                autoComplete="off"
                spellCheck={false}
                value={c.filename}
                disabled={disabled}
                aria-invalid={!c.validName}
                aria-describedby={`${id}-name-help`}
                onChange={(event) => c.changeFilename(event.target.value)}
              />
              <FieldDescription id={`${id}-name-help`}>
                {m.filenameHint}
              </FieldDescription>
              {!c.validName ? <FieldError>{m.filenameError}</FieldError> : null}
            </Field>
            <Field data-disabled={disabled}>
              <FieldLabel htmlFor={`${id}-compression`}>
                {m.compression}
              </FieldLabel>
              <Select
                value={String(c.level)}
                onValueChange={c.changeLevel}
                disabled={disabled}
              >
                <SelectTrigger id={`${id}-compression`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="6">{m.balanced}</SelectItem>
                    <SelectItem value="1">{m.fast}</SelectItem>
                    <SelectItem value="0">{m.store}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>{m.compressionHint}</FieldDescription>
            </Field>
          </FieldGroup>
          {disabled ? (
            <div className="flex flex-col gap-2">
              <div
                role="status"
                className="flex min-w-0 items-center gap-2 text-sm"
              >
                <Spinner aria-hidden="true" />
                <span>{c.status === "reading" ? m.reading : m.creating}</span>
                {c.progress ? (
                  <span className="ms-auto tabular-nums">
                    {new Intl.NumberFormat(lang, { style: "percent" }).format(
                      c.progress.percent / 100
                    )}
                  </span>
                ) : null}
              </div>
              {c.progress ? (
                <>
                  <progress
                    className="h-2 w-full accent-primary"
                    aria-label={m.creating}
                    value={c.progress.percent}
                    max={100}
                  />
                  <bdi
                    className="truncate text-xs text-muted-foreground"
                    title={c.progress.path}
                  >
                    {c.progress.path}
                  </bdi>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={disabled || !c.items.length || !c.validName}
            >
              <FileArchive aria-hidden="true" data-icon="inline-start" />
              {m.create}
            </Button>
            {disabled ? (
              <Button type="button" variant="outline" onClick={c.cancel}>
                {m.cancel}
              </Button>
            ) : null}
          </div>
          {c.result ? (
            <div
              role="status"
              className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{m.ready}</p>
                <p className="truncate text-sm" title={c.result.filename}>
                  {c.result.filename}
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.outputSize}: {formatBytes(c.result.bytes, lang)}
                </p>
              </div>
              <Button asChild className="shrink-0">
                <a
                  href={c.result.url}
                  download={c.result.filename}
                  data-astro-prefetch="false"
                >
                  <Download aria-hidden="true" data-icon="inline-start" />
                  {m.download}
                </a>
              </Button>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
