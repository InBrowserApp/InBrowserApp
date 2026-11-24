import { useId } from "react"

import { ChevronDown } from "@workspace/ui/icons"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"

import type { ImportSettings } from "./core/cid"
import type EnglishMessages from "./messages/en.json"

const chunkSizes = [262144, 524288, 1048576]
const selectClass =
  "h-8 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"

export function ImportOptions({
  settings,
  messages,
  disabled,
  onChange,
}: {
  settings: ImportSettings
  messages: typeof EnglishMessages
  disabled: boolean
  onChange: (settings: ImportSettings) => void
}) {
  const id = useId()
  return (
    <details className="group rounded-lg border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
        {messages.settings}
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground group-open:rotate-180"
        />
      </summary>
      <fieldset disabled={disabled} className="grid gap-3 border-t p-3">
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor={`${id}-version`}>
              {messages.version}
            </FieldLabel>
            <select
              className={selectClass}
              id={`${id}-version`}
              value={settings.version}
              onChange={(event) => {
                const version = event.target.value === "0" ? 0 : 1
                onChange({ ...settings, version, rawLeaves: version === 1 })
              }}
            >
              <option value={1}>CIDv1</option>
              <option value={0}>CIDv0</option>
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-chunk`}>
              {messages.chunkSize}
            </FieldLabel>
            <select
              className={selectClass}
              id={`${id}-chunk`}
              value={settings.chunkSize}
              onChange={(event) =>
                onChange({ ...settings, chunkSize: Number(event.target.value) })
              }
            >
              {chunkSizes.map((size) => (
                <option key={size} value={size}>
                  {size === 1048576 ? "1 MiB" : `${size / 1024} KiB`}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={settings.rawLeaves}
            disabled={settings.version === 0}
            onChange={(event) =>
              onChange({ ...settings, rawLeaves: event.target.checked })
            }
          />
          {messages.rawLeaves}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={settings.wrap}
            onChange={(event) =>
              onChange({ ...settings, wrap: event.target.checked })
            }
          />
          {messages.wrap}
        </label>
      </fieldset>
    </details>
  )
}
