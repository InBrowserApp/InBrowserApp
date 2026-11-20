import { useId } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { LoaderCircle } from "@workspace/ui/icons"

import type { Format } from "./compress"
import type { Messages } from "./messages"

type Settings = {
  limitInput: string
  format: Format
  allowResize: boolean
}

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
  validLimit: boolean
  canCompress: boolean
  progressLabel: string
  messages: Messages
}

const formats = ["jpg", "webp"] as const

export function CompressionSettings({
  settings,
  onChange,
  validLimit,
  canCompress,
  progressLabel,
  messages,
}: Props) {
  const id = useId()
  const { limitInput, format, allowResize } = settings
  return (
    <fieldset
      disabled={Boolean(progressLabel)}
      className="flex min-w-0 flex-col gap-4 self-start rounded-xl border bg-card p-5 shadow-xs"
    >
      <h2 className="font-heading text-lg">{messages.settings}</h2>
      <div className="grid gap-1.5">
        <label htmlFor={`${id}-limit`} className="text-sm font-medium">
          {messages.sizeLimit}
        </label>
        <div className="relative">
          <Input
            id={`${id}-limit`}
            aria-describedby={`${id}-unit`}
            className="h-10 pe-12 tabular-nums"
            type="text"
            inputMode="decimal"
            aria-invalid={limitInput !== "" && !validLimit}
            required
            value={limitInput}
            onChange={(event) =>
              onChange({ ...settings, limitInput: event.target.value })
            }
          />
          <span
            className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-sm text-muted-foreground"
            aria-hidden="true"
          >
            KB
          </span>
        </div>
        <p id={`${id}-unit`} className="text-xs text-muted-foreground">
          {messages.sizeHint}
        </p>
      </div>
      <fieldset className="grid gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">
          {messages.format}
        </legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border bg-muted/45 p-1">
          {formats.map((option) => (
            <label key={option} className="min-w-0">
              <input
                className="peer sr-only"
                type="radio"
                name={`${id}-format`}
                value={option}
                checked={format === option}
                onChange={() => onChange({ ...settings, format: option })}
              />
              <span className="block cursor-pointer rounded-md py-1.5 text-center text-sm font-medium text-muted-foreground peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                {option === "jpg" ? "JPG" : "WebP"}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {format === "jpg" ? messages.jpgHint : messages.webpHint}
        </p>
      </fieldset>
      <label
        htmlFor={`${id}-resize`}
        aria-labelledby={`${id}-resize-label`}
        className="flex cursor-pointer items-start gap-2.5 border-t pt-4"
      >
        <input
          type="checkbox"
          id={`${id}-resize`}
          aria-describedby={`${id}-resize-hint`}
          className="mt-0.5 size-4 shrink-0 accent-primary"
          checked={allowResize}
          onChange={(event) =>
            onChange({ ...settings, allowResize: event.target.checked })
          }
        />
        <span className="flex flex-col gap-1">
          <span id={`${id}-resize-label`} className="text-sm font-medium">
            {messages.allowResize}
          </span>
          <span
            id={`${id}-resize-hint`}
            className="text-xs text-muted-foreground"
          >
            {messages.resizeHint}
          </span>
        </span>
      </label>
      <Button
        className="h-auto min-h-10 py-2 whitespace-normal"
        type="submit"
        disabled={!canCompress}
      >
        {progressLabel && (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        )}
        {progressLabel || messages.compress}
      </Button>
    </fieldset>
  )
}
