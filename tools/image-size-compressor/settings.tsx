import { useId, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { LoaderCircle } from "@workspace/ui/icons"

import type { DimensionConstraint, Format } from "./compress"
import type { Messages } from "./messages"
import { ExactDimensions } from "./exact-dimensions"

export type Settings = {
  limitInput: string
  format: Format
  dimensionMode: DimensionConstraint["mode"]
  widthInput: string
  heightInput: string
  fit: "contain" | "cover"
}

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
  validLimit: boolean
  limitLabel: string
  firstFile: File | undefined
  canCompress: boolean
  progressLabel: string
  messages: Messages
  resultSummary: string
  resultsId: string
}

const selectClass =
  "h-10 min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const formats = ["jpg", "webp"] as const

export function CompressionSettings({
  settings,
  onChange,
  validLimit,
  limitLabel,
  firstFile,
  canCompress,
  progressLabel,
  messages,
  resultSummary,
  resultsId,
}: Props) {
  const id = useId()
  const [ratio, setRatio] = useState<number | null>(null)
  const { limitInput, format, dimensionMode, widthInput, heightInput, fit } =
    settings
  return (
    <div className="flex min-w-0 flex-col gap-4 self-start rounded-xl border bg-card p-5 shadow-xs">
      <fieldset
        disabled={Boolean(progressLabel)}
        className="flex min-w-0 flex-col gap-4"
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
              value={limitInput}
              onChange={(event) =>
                onChange({ ...settings, limitInput: event.target.value })
              }
            />
            {!/(?:kb|mb)\s*$/i.test(limitInput.normalize("NFKC")) && (
              <span
                className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-sm text-muted-foreground"
                aria-hidden="true"
              >
                KB
              </span>
            )}
          </div>
          <p
            id={`${id}-unit`}
            className={
              validLimit
                ? "text-xs text-muted-foreground"
                : "text-xs text-destructive"
            }
          >
            {validLimit ? messages.sizeHint : messages.invalidSize}
            {limitLabel && (
              <span className="mt-1 block text-foreground">{limitLabel}</span>
            )}
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
        <div className="grid gap-3 border-t pt-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              {messages.dimensionMode}
            </legend>
            <div className="grid gap-1 rounded-lg border bg-muted/35 p-1">
              {(
                [
                  ["original", messages.keepDimensions],
                  ["shrink", messages.allowResize],
                  ["exact", messages.exactDimensions],
                ] as const
              ).map(([mode, label]) => (
                <label key={mode} className="relative">
                  <input
                    type="radio"
                    name={`${id}-dimensions`}
                    className="peer sr-only"
                    checked={dimensionMode === mode}
                    onChange={() =>
                      onChange({ ...settings, dimensionMode: mode })
                    }
                  />
                  <span className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm peer-checked:border-border peer-checked:bg-background peer-checked:font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {dimensionMode === "exact" && (
            <>
              <ExactDimensions
                widthInput={widthInput}
                heightInput={heightInput}
                firstFile={firstFile}
                ratio={ratio}
                onRatioChange={setRatio}
                onChange={(widthInput, heightInput) =>
                  onChange({ ...settings, widthInput, heightInput })
                }
                messages={messages}
              />
              <div className="grid gap-1.5">
                <label htmlFor={`${id}-fit`} className="text-sm font-medium">
                  {messages.fit}
                </label>
                <select
                  id={`${id}-fit`}
                  className={selectClass}
                  value={fit}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      fit: event.target.value as Settings["fit"],
                    })
                  }
                >
                  <option value="contain">{messages.contain}</option>
                  <option value="cover">{messages.cover}</option>
                </select>
              </div>
            </>
          )}
        </div>
      </fieldset>
      <div
        className={
          resultSummary
            ? "flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground"
            : "sr-only"
        }
      >
        <p role="status">{progressLabel || resultSummary}</p>
        {resultSummary && (
          <a
            href={`#${resultsId}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {messages.viewResults}
          </a>
        )}
      </div>
      <Button
        className="h-auto min-h-10 py-2 whitespace-normal aria-disabled:cursor-wait"
        type="submit"
        disabled={!progressLabel && !canCompress}
        aria-disabled={Boolean(progressLabel)}
      >
        {progressLabel && (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        )}
        {progressLabel || messages.compress}
      </Button>
    </div>
  )
}
