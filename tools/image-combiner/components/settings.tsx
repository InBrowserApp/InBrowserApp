import { useId } from "react"

import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Columns2, LayoutGrid, Rows2 } from "@workspace/ui/icons"

import type { Layout } from "../core/layout"
import type { Messages } from "../types"

const layoutIcons = { horizontal: Columns2, vertical: Rows2, grid: LayoutGrid }

export type Settings = {
  layout: Layout
  columns: string
  gap: string
  transparent: boolean
  color: string
  matched: boolean
  width: string
  height: string
}

type Props = {
  messages: Messages
  settings: Settings
  update: (change: Partial<Settings>) => void
}

function NumberField({
  label,
  name,
  value,
  min,
  onChange,
  placeholder,
}: {
  label: string
  name: string
  value: string
  min: number
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="font-medium">{label}</span>
      <Input
        autoComplete="off"
        className="h-9 tabular-nums"
        dir="ltr"
        inputMode="numeric"
        min={min}
        name={name}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        step={1}
        type="number"
        value={value}
      />
    </label>
  )
}

export function SettingsCard({ messages, settings, update }: Props) {
  const id = useId()

  return (
    <Card>
      <CardContent className="grid gap-4">
        <fieldset className="min-w-0">
          <legend className="mb-2 font-medium">{messages.layout}</legend>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {(Object.keys(layoutIcons) as Layout[]).map((layout) => {
              const Icon = layoutIcons[layout]
              return (
                <label
                  className="relative flex min-w-0 cursor-pointer touch-manipulation"
                  key={layout}
                >
                  <input
                    checked={settings.layout === layout}
                    className="peer sr-only"
                    name={id}
                    onChange={() => update({ layout })}
                    type="radio"
                    value={layout}
                  />
                  <span className="flex min-h-15 w-full flex-col items-center justify-center gap-1 rounded-md border border-transparent px-1 py-1.5 text-center text-xs/4 font-medium wrap-anywhere text-muted-foreground peer-checked:border-border peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:text-foreground">
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {messages[layout]}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div
          className={
            settings.layout === "grid" ? "grid grid-cols-2 gap-3" : "grid"
          }
        >
          <NumberField
            label={messages.spacing}
            min={0}
            name="spacing"
            onChange={(gap) => update({ gap })}
            value={settings.gap}
          />
          {settings.layout === "grid" && (
            <NumberField
              label={messages.columns}
              min={1}
              name="columns"
              onChange={(columns) => update({ columns })}
              value={settings.columns}
            />
          )}
        </div>

        <div className="grid gap-1.5">
          <label className="font-medium" htmlFor={`${id}-background`}>
            {messages.background}
          </label>
          <div className="flex gap-2">
            <select
              autoComplete="off"
              className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 text-base text-foreground shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
              id={`${id}-background`}
              name="background"
              onChange={(event) =>
                update({
                  transparent: event.currentTarget.value === "transparent",
                })
              }
              value={settings.transparent ? "transparent" : "solid"}
            >
              <option value="transparent">{messages.transparent}</option>
              <option value="solid">{messages.solidColor}</option>
            </select>
            {!settings.transparent && (
              <Input
                aria-label={messages.backgroundColor}
                className="h-9 w-12 shrink-0 cursor-pointer px-1"
                name="background-color"
                onChange={(event) =>
                  update({ color: event.currentTarget.value })
                }
                title={messages.backgroundColor}
                type="color"
                value={settings.color}
              />
            )}
          </div>
        </div>

        <div className="grid gap-2 border-t pt-3">
          <label className="flex min-h-8 w-fit cursor-pointer items-center gap-2 font-medium">
            <input
              aria-describedby={
                settings.matched ? `${id}-match-hint` : undefined
              }
              checked={settings.matched}
              className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              name="match-sizes"
              onChange={(event) =>
                update({ matched: event.currentTarget.checked })
              }
              type="checkbox"
            />
            {messages.matchSizes}
          </label>
          {settings.matched && (
            <>
              <div
                className={
                  settings.layout === "grid" ? "grid grid-cols-2 gap-3" : "grid"
                }
              >
                {settings.layout !== "horizontal" && (
                  <NumberField
                    label={messages.width}
                    min={1}
                    name="width"
                    onChange={(width) => update({ width })}
                    placeholder={messages.auto}
                    value={settings.width}
                  />
                )}
                {settings.layout !== "vertical" && (
                  <NumberField
                    label={messages.height}
                    min={1}
                    name="height"
                    onChange={(height) => update({ height })}
                    placeholder={messages.auto}
                    value={settings.height}
                  />
                )}
              </div>
              <p
                className="text-xs/5 text-muted-foreground"
                id={`${id}-match-hint`}
              >
                {messages.matchSizesHint}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
