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
  firstFile: File | undefined
  canCompress: boolean
  progressLabel: string
  messages: Messages
}

const selectClass =
  "h-10 min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const formats = ["jpg", "webp"] as const

export function CompressionSettings({
  settings,
  onChange,
  validLimit,
  firstFile,
  canCompress,
  progressLabel,
  messages,
}: Props) {
  const id = useId()
  const [ratio, setRatio] = useState<number | null>(null)
  const { limitInput, format, dimensionMode, widthInput, heightInput, fit } =
    settings
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
      <div className="grid gap-3 border-t pt-4">
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-dimensions`} className="text-sm font-medium">
            {messages.dimensionMode}
          </label>
          <select
            id={`${id}-dimensions`}
            className={selectClass}
            value={dimensionMode}
            onChange={(event) =>
              onChange({
                ...settings,
                dimensionMode: event.target.value as Settings["dimensionMode"],
              })
            }
          >
            <option value="original">{messages.keepDimensions}</option>
            <option value="shrink">{messages.allowResize}</option>
            <option value="exact">{messages.exactDimensions}</option>
          </select>
        </div>
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
